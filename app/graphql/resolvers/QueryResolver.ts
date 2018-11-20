import * as dbs from '../dataFiles';
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DATA_DIR, CACHE_DIR, MAP_DIR } from '../../consts';
import MapConnector from '../connector/MapConnector';
import { getAllSkillInfluenceMeta } from '../connector/SkillInfluenceMetaConnector';
import { getAllAbilityConfigMeta } from '../connector/AbilityConfigMetaConnector';
import CardConnector from '../connector/CardConnector';
import QuestConnector from '../connector/QuestConnector';
import * as EmojiConnector from '../connector/EmojiConnector';
import bus from '../../bus';

function fileStatusResolver(files: string[]) {
  return () => {
    const result: Array<{
      Exist: boolean;
      UpdateTime: Date | null;
      Name: string;
    }> = [];
    files.forEach(filename => {
      const filePath = path.join(DATA_DIR, filename);
      const exist = fs.existsSync(filePath);
      result.push({
        Exist: exist,
        UpdateTime: exist
          ? fs.statSync(path.join(DATA_DIR, filename)).ctime
          : null,
        Name: filename,
      });
    });
    return result;
  };
}

export default {
  file: (root: any, args: any) => _.find(dbs.fileList.data, args),
  files: () => dbs.fileList.data,
  card: (root: any, args: any) => CardConnector.getCard(args.CardID),
  cards: (root: any, args: any) => _.filter(CardConnector.getCards(), args),
  missions: () => dbs.missionConfig.data,
  mission: (root: any, args: any) => _.find(dbs.missionConfig.data, args),
  quest: (root: any, args: any) => QuestConnector.getQuest(args.QuestID),
  quests: () => QuestConnector.getQuests(),
  ability: (root: any, args: any) => _.find(dbs.abilityList.data, args),
  abilities: () =>
    dbs.abilityList.data.map((ability: any, index: number) => ({
      ...ability,
      AbilityID: index,
    })),
  uploadFiles: fileStatusResolver(dbs.uploadDbFiles),
  map: async (root: any, args: any) => MapConnector(args.MapID),
  battleTalks: () => dbs.questEventText.data,
  classes: () => dbs.classData.data.filter((c: any) => c.Name),
  skills: () =>
    dbs.skillList.data.map((skill: any, index: number) => ({
      ...skill,
      SkillID: index,
    })),
  skillInfluenceMetas: getAllSkillInfluenceMeta,
  abilityConfigMetas: getAllAbilityConfigMeta,
  emojis: async () => EmojiConnector.getEmojis(),
  serverStatus: () => bus.status,
};
