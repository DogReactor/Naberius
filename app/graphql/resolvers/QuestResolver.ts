import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as dbs from '../dataFiles';
import { EVENT_ARC_DIR } from '../../consts';
import MapConnector from '../connector/MapConnector';

export default {
  Mission: (quest: any) => {
    const mission = _.find(dbs.missionQuestList.data, {
      QuestID: quest.QuestID,
    }) as any;
    if (mission) {
      return _.find(dbs.missionConfig.data, { MissionID: mission.MissionID });
    } else {
      return null;
    }
  },
  Map: async (quest: any) => MapConnector(quest.MapNo),
  EventArcs: (quest: any) => {
    const filename = `${quest.QuestID}.json`;
    const filePath = path.join(EVENT_ARC_DIR, filename);
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(
        fs.readFileSync(filePath, { encoding: 'utf-8' }),
      );
      return content;
    } else {
      return [];
    }
  },
};
