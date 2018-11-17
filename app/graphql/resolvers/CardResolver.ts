import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dbs from '../dataFiles';
import { numberPadding } from '../utils';
import { HARLEM_TEXT_A_DIR, HARLEM_TEXT_R_DIR } from '../../consts';
import DotConnector from '../connector/DotConnector';
import { getCardMeta } from '../connector/CardMetaConnector';

function fileSorter(a: any, b: any) {
  if (a.Name < b.Name) {
    return -1;
  } else if (a.Name === b.Name) {
    return 0;
  }
  return 1;
}
export default {
  Dots: DotConnector,
  HarlemTextA: (card: any) => {
    const filenames = [
      `EventText_${numberPadding(card.CardID, 4)}_1.txt`,
      `EventText_${numberPadding(card.CardID, 4)}_2.txt`,
    ];
    if (fs.existsSync(path.join(HARLEM_TEXT_A_DIR, filenames[0]))) {
      const files = filenames.map(filename =>
        fs.readFileSync(path.join(HARLEM_TEXT_A_DIR, filename), {
          encoding: 'utf-8',
        }),
      );

      const filename3 = `EventText_${numberPadding(card.CardID, 4)}_2.json`;
      if (fs.existsSync(path.join(HARLEM_TEXT_A_DIR, filename3))) {
        const f3 = fs.readFileSync(path.join(HARLEM_TEXT_A_DIR, filename3), {
          encoding: 'utf-8',
        });
        files.push(
          JSON.parse(f3)
            .map((text: any) =>
              text._TalkerName
                ? `@${text._TalkerName}\n${text._TalkText}`
                : text._TalkText,
            )
            .join('\n\n')
            .replace(/\n/g, '\r\n'),
        );
      }
      return files;
    } else {
      return [];
    }
  },
  HarlemTextR: (card: any) => {
    const filenames = [
      `HarlemText_${numberPadding(card.CardID, 4)}_0.txt`,
      `HarlemText_${numberPadding(card.CardID, 4)}_1.txt`,
    ];
    if (fs.existsSync(path.join(HARLEM_TEXT_R_DIR, filenames[0]))) {
      const files = filenames.map(filename =>
        fs.readFileSync(path.join(HARLEM_TEXT_R_DIR, filename), {
          encoding: 'utf-8',
        }),
      );

      const filename3 = `HarlemText_${numberPadding(card.CardID, 4)}_2.json`;
      if (fs.existsSync(path.join(HARLEM_TEXT_R_DIR, filename3))) {
        const f3 = fs.readFileSync(path.join(HARLEM_TEXT_R_DIR, filename3), {
          encoding: 'utf-8',
        });
        files.push(
          JSON.parse(f3)
            .map((text: any) =>
              text._TalkerName
                ? `@${text._TalkerName}\n${text._TalkText}`
                : text._TalkText,
            )
            .join('\n\n')
            .replace(/\n/g, '\r\n'),
        );
      }
      return files;
    } else {
      return [];
    }
  },
  NickName: async (card: any) => {
    const cardMeta = await getCardMeta(card.CardID);
    if (cardMeta) {
      return cardMeta.NickName;
    }
    return null;
  },
  ConneName: async (card: any) => {
    const cardMeta = await getCardMeta(card.CardID);
    if (cardMeta) {
      return cardMeta.ConneName;
    }
    return null;
  },
  // extreamly slow
  ImageStand: (card: any) =>
    _.chain(dbs.fileList.data)
      .filter(file => {
        return !!RegExp(
          `^${(Array(3).join('0') + card.CardID).slice(-3)}_card_\\d\\.png$`,
        ).exec(file.Name);
      })
      .slice()
      .sort(fileSorter)
      .map(file => file.Link)
      .value(),
  // extreamly slow
  ImageCG: (card: any) =>
    _.chain(dbs.fileList.data)
      .filter(file => {
        return !!RegExp(
          `^HarlemCG_${(Array(3).join('0') + card.CardID).slice(
            -3,
          )}_\\d\\.png$`,
        ).exec(file.Name);
      })
      .slice()
      .sort(fileSorter)
      .map(file => file.Link)
      .value(),
};
