import * as dbs from '../dataFiles';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs-extra';
import { parseAL, ALAR, ALTX } from 'aigis-fuel';
import { numberPadding, requestFile, ALTX2PNG } from '../utils';
import { ENEMYDOT_IMG_DIR, ENEMYDOT_INFO_DIR } from '../../consts';
import QuestConnector from '../connector/QuestConnector';

async function grabEnemy(enemy: any) {
  const patternID = (enemy.PatternID >> 8) % 4096;
  const dotImagePath = path.join(ENEMYDOT_IMG_DIR, `${patternID}.png`);
  const dotInfoPath = path.join(ENEMYDOT_INFO_DIR, `${patternID}.json`);
  if (!(fs.existsSync(dotImagePath) && fs.existsSync(dotInfoPath))) {
    const aarFilename = `EnemyDot${numberPadding(patternID, 4)}.aar`;
    const aarFile = parseAL(await requestFile(aarFilename)) as ALAR;
    let existAttack = false;
    for (const file of aarFile.Files) {
      // save a frame image
      if (file.Content && file.Content.Head === 'ALTX') {
        const atx = file.Content as ALTX;
        const sprite = atx.Sprites[Object.keys(atx.Sprites)[0] as any][0];
        await ALTX2PNG(atx)
          .extract({
            left: sprite.X,
            top: sprite.Y,
            height: sprite.Height,
            width: sprite.Width,
          })
          .toFile(dotImagePath);
      }
      if (file.Content && file.Name === 'Attack.aod') {
        existAttack = true;
        fs.writeFileSync(
          dotInfoPath,
          JSON.stringify({ Length: file.Content.ALMT.Length }),
        );
      }
    }
    // no attack animation (don't attack)
    if (!existAttack) {
      fs.writeFileSync(dotInfoPath, JSON.stringify({ Length: 0 }));
    }
  }
}

export default {
  Quests: ({ MissionID }: any) => {
    return _.chain(dbs.missionQuestList.data)
      .filter({ MissionID })
      .map(({ QuestID }: any) => QuestConnector.getQuest(QuestID))
      .filter(q => q)
      .value();
  },
  Enemies: async ({ MissionID }: any) => {
    const enemies: any = _.find(dbs.Enemy.data, { MissionID });
    fs.ensureDirSync(ENEMYDOT_IMG_DIR);
    fs.ensureDirSync(ENEMYDOT_INFO_DIR);
    if (enemies) {
      await Promise.all(enemies.Enemies.map((enemy: any) => grabEnemy(enemy)));
      return enemies.Enemies;
    }
    return null;
  },
  BattleTalks: ({ MissionID }: any) => {
    const events: any = _.find(dbs.battleTalkEvent.data, { MissionID });
    if (events) {
      let index = -1;
      events.Events.forEach((event: any) => {
        if (event.RecordOffset) {
          index = event.RecordOffset;
          event.RecordIndex = event.RecordOffset;
        } else {
          event.RecordIndex = ++index;
        }
      });
      return events.Events;
    }
    return null;
  },
};
