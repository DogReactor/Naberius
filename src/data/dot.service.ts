import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { ParsedConfigService } from 'config/config.service';
import { Dot } from './models/dot.model';
import { join } from 'path';
import { writeFile, readFile, ensureDir, pathExists } from 'fs-extra';
import { numberPadding, ALTX2PNG } from 'common/utils';
import { ALTX, parseAL, ALMT, ALOD, ALAR } from 'aigis-fuel';
import { Logger } from 'logger/logger.service';

@Injectable()
export class DotService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
    private readonly logger: Logger,
  ) {}

  async get(CardID: number, type: 'Enemy' | 'Player') {
    const dotPath = join(
      this.config.get(type === 'Player' ? 'PLAYER_DOT_DIR' : 'ENEMY_DOT_DIR'),
      CardID.toString(),
    );
    const dotImagePath = join(dotPath, `sprite.png`);
    const dotInfoPath = join(dotPath, `info.json`);
    try {
      if (
        !((await pathExists(dotImagePath)) && (await pathExists(dotInfoPath)))
      ) {
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
                Sprites: entry.Fields.Texture0ID
                  ? sprites[entry.Fields.Texture0ID.Id1]
                  : Object.values(sprites).slice(-1)[0],
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

        await writeFile(dotInfoPath, JSON.stringify(dots));
      }
    } catch (err) {
      this.logger.error(err);
      return null;
    }

    const fileRes = await readFile(dotInfoPath, 'utf-8');
    try {
      const dots = JSON.parse(fileRes) as Dot[];
      return dots;
    } catch (err) {
      console.log(fileRes);
      this.logger.error(err);
      return null;
    }
  }
}
