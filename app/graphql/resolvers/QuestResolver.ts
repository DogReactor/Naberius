import * as dbs from '../dataFiles';
import * as _ from 'lodash';
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
};
