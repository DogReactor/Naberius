import {
  missionConfig,
  messageText,
  questNameText,
  questListOrigin,
  missionQuestList,
} from '../dataFiles';
import * as _ from 'lodash';
import { logger } from '../../logger';
class QuestConnector {
  private quests: any[] = [];

  constructor() {
    try {
      this.init();
    } catch (err) {
      logger.error(err.stack);
      logger.error('QuestConnector init failed');
    }
  }

  public init() {
    missionConfig.data.forEach(({ MissionID }: any) => {
      const nameTexts: any = questNameText.data.find(
        (name: any) => name.MissionID === MissionID,
      );
      const messageTexts: any = messageText.data.find(
        (message: any) => message.MissionID === MissionID,
      );
      if (nameTexts && messageTexts) {
        _.chain(missionQuestList.data)
          .filter({ MissionID })
          .sortBy('MissionID')
          .reverse()
          .forEach(({ QuestID }: any) => {
            if (!this.quests.find(quest => quest.QuestID === QuestID)) {
              const quest: any = questListOrigin.data.find(
                (questOrigin: any) => questOrigin.QuestID === QuestID,
              );
              if (quest) {
                quest.Name = nameTexts.Names[quest.QuestTitle].Message;
                quest.Message = messageTexts.Messages[quest.Text].Message;
                quest.MissionID = MissionID;
                this.quests.push(quest);
              }
            }
          })
          .value();
      }
    });
  }

  public getQuest(QuestID: number) {
    return this.quests.find(quest => quest.QuestID === QuestID);
  }

  public getQuests() {
    return this.quests;
  }
}

export default new QuestConnector();
