import * as dbs from '../dataFiles';
import * as _ from 'lodash';
import QuestConnector from '../connector/QuestConnector';
import { grabEnemy } from '../connector/EnemyConnector';

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
      // sometimes RecordOffset will stick to a non-zero number
      let stopIndex = -1;
      events.Events.forEach((event: any) => {
        if (event.RecordOffset && stopIndex !== event.RecordOffset) {
          index = event.RecordOffset;
          stopIndex = event.RecordOffset;
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
