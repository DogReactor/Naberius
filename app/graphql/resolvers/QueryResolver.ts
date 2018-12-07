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

interface File {
  Link: string;
  Name: string;
}

function fileListCompare(newFileList: File[], oldFileList: File[]) {
  const newFiles: File[] = [];
  const modifiedFiles: File[] = [];
  const deletedFiles: File[] = [];
  newFileList.forEach(newFile => {
    const oldFile = oldFileList.find(o => o.Name === newFile.Name);
    if (!oldFile) {
      newFiles.push(newFile);
    } else if (oldFile.Link !== newFile.Link) {
      modifiedFiles.push(newFile);
    }
  });
  oldFileList.forEach(oldFile => {
    if (!newFileList.find(newFile => newFile.Name === oldFile.Name)) {
      deletedFiles.push(oldFile);
    }
  });
  return {
    newFiles,
    modifiedFiles,
    deletedFiles,
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
  classes: (root: any, args: any) => {
    const MaterialID = args.MaterialID;
    const classes = dbs.classData.data.filter((c: any) => c.Name);
    if (MaterialID) {
      return classes.filter(
        (c: any) =>
          c.JobChangeMaterial1 === MaterialID ||
          c.JobChangeMaterial2 === MaterialID ||
          c.JobChangeMaterial3 === MaterialID,
      );
    } else {
      return classes;
    }
  },
  class: (root: any, args: any) => {
    return _.find(dbs.classData.data.filter((c: any) => c.Name), args);
  },
  skills: () =>
    dbs.skillList.data.map((skill: any, index: number) => ({
      ...skill,
      SkillID: index,
    })),
  skillInfluenceMetas: getAllSkillInfluenceMeta,
  abilityConfigMetas: getAllAbilityConfigMeta,
  emojis: async () => EmojiConnector.getEmojis(),
  serverStatus: () => bus.status,
  posters: () =>
    fs
      .readdirSync(path.join('static', 'poster'))
      .map(filename => path.basename(filename, '.jpg')),
  logs: () => bus.log,
  fileDiff: () => fileListCompare(dbs.fileList.data, dbs.fileListOld.data),
};
