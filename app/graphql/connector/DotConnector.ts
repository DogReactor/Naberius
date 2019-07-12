import * as fs from 'fs-extra';
import * as path from 'path';
import { parseAL, ALTX, ALAR, ALMT, ALOD } from 'aigis-fuel';
import { PLAYERDOT_IMG_DIR, PLAYERDOT_INFO_DIR } from '../../consts';
import { requestFile, numberPadding, ALTX2PNG } from '../utils';
import { logger } from '../../logger';
import * as _ from 'lodash';

export default async (card: any) => {
  let dots: any[];
  fs.ensureDirSync(PLAYERDOT_IMG_DIR);
  fs.ensureDirSync(PLAYERDOT_INFO_DIR);
  const dotImagePath = path.join(PLAYERDOT_IMG_DIR, `${card.CardID}.png`);
  const dotInfoPath = path.join(PLAYERDOT_INFO_DIR, `${card.CardID}.json`);
  if (!(fs.existsSync(dotImagePath) && fs.existsSync(dotInfoPath))) {
    dots = [];
    let sprites: { [key: number]: ALTX.FrameTable } = {};
    const aarFilename = `PlayerDot${numberPadding(card.CardID, 4)}.aar`;
    let aarFile: any;
    try {
      const file = await requestFile(aarFilename);
      aarFile = parseAL(file) as ALAR;
    } catch (e) {
      logger.error(e);
      return null;
    }
    for (const file of aarFile.Files) {
      if (file.Name.split('.')[1] === 'atx' && file.Content) {
        const content = file.Content as ALTX;
        sprites = content.Sprites;
        await ALTX2PNG(content).toFile(
          path.join(PLAYERDOT_IMG_DIR, `${card.CardID}.png`),
        );
      } else if (file.Name.split('.')[1] === 'aod' && file.Content) {
        const alod = file.Content as ALOD;
        const almt = alod.ALMT as ALMT;
        const dot: any = {
          Name: file.Name.split('.')[0],
          Length: almt.Length,
          Entries: [],
          Image: '',
        };
        alod.Entries.forEach(entry => {
          dot.Entries.push({
            Name: entry.Name.slice(0, 4),
            Sprites: entry.Fields.Texture0ID.Id1,
          });
        });
        almt.Entries.forEach(entry => {
          const entryIndex = _.findIndex(dot.Entries, { Name: entry.Name });
          dot.Entries[entryIndex] = {
            ...dot.Entries[entryIndex],
            ...entry,
          };
        });
        dots.push(dot);
      }
    }
    dots = dots.map(dot => {
      dot.Entries = dot.Entries.map((entry: any) => {
        entry.Sprites = sprites[entry.Sprites.toString()];
        return entry;
      });
      return dot;
    });

    fs.writeFileSync(dotInfoPath, JSON.stringify(dots));
  } else {
    dots = JSON.parse(fs.readFileSync(dotInfoPath, { encoding: 'utf-8' }));
  }
  return dots;
};
