import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { ParsedConfigService } from 'config/config.service';
import { Dot } from './models/dot.model';
import { join } from 'path';
import { writeFile, readFile, ensureDir, pathExists } from 'fs-extra';
import { numberPadding, ALTX2PNG } from 'common/utils';
import { ALTX, parseAL, ALMT, ALOD, ALAR } from 'aigis-fuel';

@Injectable()
export class DotService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
  ) {}

  async get(CardID: number, type: 'Enemy' | 'Player') {
    const dotPath = join(
      this.config.get(type === 'Player' ? 'PLAYER_DOT_DIR' : 'ENEMY_DOT_DIR'),
      CardID.toString(),
    );
    const dotImagePath = join(dotPath, `sprite.png`);
    const dotInfoPath = join(dotPath, `info.json`);
    if (!(await pathExists(dotPath))) {
      await ensureDir(dotPath);
      const dots: Dot[] = [];
      let sprites: { [key: number]: ALTX.FrameTable } = {};
      const aarFilename = `${type}Dot${numberPadding(CardID, 4)}.aar`;
      const aarFile = parseAL(
        await this.request.requestFile(aarFilename),
      ) as ALAR;

      // extract atx picture file
      // only extract one atx file if there's multiple
      let tx = false;
      for (const file of aarFile.Files) {
        if (file.Name.split('.')[1] === 'atx' && file.Content && !tx) {
          const content = file.Content as ALTX;
          sprites = content.Sprites;
          await ALTX2PNG(content).toFile(dotImagePath);
          tx = true;
        }
      }

      // aod file
      for (const file of aarFile.Files) {
        if (file.Name.split('.')[1] === 'aod' && file.Content) {
          const alod = file.Content as ALOD;
          const almt = alod.ALMT as ALMT;
          const dot: Dot = {
            Name: file.Name.split('.')[0],
            Length: almt.Length,
            Entries: [],
          };
          alod.Entries.forEach(entry => {
            dot.Entries.push({
              Name: entry.Name.slice(0, 4),
              Sprites: sprites[entry.Fields.Texture0ID.Id1],
            });
          });
          almt.Entries.forEach(entry => {
            const entryIndex = dot.Entries.findIndex(
              e => e.Name === entry.Name,
            );
            dot.Entries[entryIndex] = {
              ...dot.Entries[entryIndex],
              ...entry,
            };
          });
          dots.push(dot);
        }
      }

      // dots = dots
      //   .map(dot => {
      //     dot.Entries = dot.Entries.map(entry => {
      //       entry.Sprites = sprites[entry.Sprites.toString()];
      //       if (!entry.Sprites) {
      //         return null;
      //       }
      //       return entry;
      //     }).filter(entry => entry);
      //     if (dot.Entries.length === 0) {
      //       return null;
      //     }
      //     return dot;
      //   })
      //   .filter(dot => dot);

      await writeFile(dotInfoPath, JSON.stringify(dots));
    }
    const file = await readFile(dotInfoPath, 'utf-8');
    try {
      const dots = JSON.parse(file) as Dot[];
      return dots;
    } catch (err) {
      console.log(file);
      throw err;
    }
  }
}
