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
    this.init();
  }

  public init() {
    try {
      logger.error('QuestConnector initing...');
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
      logger.error('QuestConnector inited!');
    } catch (err) {
      logger.error('QuestConnector init failed');
    }
  }

  public getQuest(QuestID: number) {
    return this.quests.find(quest => quest.QuestID === QuestID);
  }

  public getQuests() {
    return this.quests;
  }
}

export default new QuestConnector();
