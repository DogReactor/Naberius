import * as fs from 'fs-extra';
import * as path from 'path';
import { DATA_DIR, CACHE_DIR } from '../consts';

export const uploadDbFiles = [
  'FileList.json',
  'FileListA.json',
  'CardList.json',
  'QuestList.json',
];

class JsonDb {
  public data: any;
  public filename: string;
  public dir: string;
  public get path() {
    return path.join(this.dir, this.filename);
  }
  public constructor(filename: string, dir: string) {
    this.filename = filename;
    this.dir = dir;
    this.read();
  }
  public read() {
    if (fs.existsSync(this.path)) {
      this.data = JSON.parse(
        fs.readFileSync(this.path, {
          encoding: 'utf-8',
        }),
      );
    } else {
      this.write('');
    }
  }

  public write(data: any) {
    this.data = data;
    fs.ensureFileSync(this.path);
    fs.writeFileSync(this.path, JSON.stringify(data));
  }
}

export const fileList = new JsonDb('FileList.json', DATA_DIR);
export const fileListA = new JsonDb('FileListA.json', DATA_DIR);
export const cardList = new JsonDb('CardList.json', DATA_DIR);
export const questListOrigin = new JsonDb('QuestList.json', DATA_DIR);
// export const questList = new JsonDb('QuestList.json', CACHE_DIR);
export const nameText = new JsonDb('NameText.json', CACHE_DIR);
export const skillList = new JsonDb('SkillList.json', CACHE_DIR);
export const skillText = new JsonDb('SkillText.json', CACHE_DIR);
export const abilityList = new JsonDb('AbilityList.json', CACHE_DIR);
export const abilityText = new JsonDb('AbilityText.json', CACHE_DIR);
export const classData = new JsonDb('ClassData.json', CACHE_DIR);
export const statusText = new JsonDb('StatusText.json', CACHE_DIR);
export const systemText = new JsonDb('SystemText.json', CACHE_DIR);
export const playerRaceType = new JsonDb('PlayerRaceType.json', CACHE_DIR);
export const playerAssignType = new JsonDb('PlayerAssignType.json', CACHE_DIR);
export const playerIdentityType = new JsonDb(
  'PlayerIdentityType.json',
  CACHE_DIR,
);
export const missionQuestList = new JsonDb('MissionQuestList.json', CACHE_DIR);
export const missionConfig = new JsonDb('MissionConfig.json', CACHE_DIR);
export const questNameText = new JsonDb('QuestNameText.json', CACHE_DIR);
export const messageText = new JsonDb('MessageText.json', CACHE_DIR);
export const enemyElem = new JsonDb('EnemyElem.json', CACHE_DIR);
export const enemyType = new JsonDb('EnemyType.json', CACHE_DIR);
export const skillTypeList = new JsonDb('SkillTypeList.json', CACHE_DIR);
export const questEventText = new JsonDb('QuestEventText.json', CACHE_DIR);
export const skillInfluenceConfig = new JsonDb(
  'SkillInfluenceConfig.json',
  CACHE_DIR,
);
export const abilityConfig = new JsonDb('AbilityConfig.json', CACHE_DIR);
export const Enemy = new JsonDb('Enemy.json', CACHE_DIR);
export const battleTalkEvent = new JsonDb('BattleTalkEvent.json', CACHE_DIR);

export function cacheLoader(name: string) {
  return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, name), 'utf-8'));
}
