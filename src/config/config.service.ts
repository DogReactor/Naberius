import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Consts } from './consts';
import { Config } from './config.model';
import { ensureDirSync } from 'fs-extra';

@Injectable()
export class ConfigService {
  private readonly config: Config;

  constructor(filePath: string) {
    this.config = {
      ...Consts,
      ...JSON.parse(readFileSync(join(filePath, 'config.json'), 'utf-8')),
    };
    this.joinDir('DATA_DIR', 'FILES_ROOT_DIR');
    this.joinDir('CACHE_DIR', 'FILES_ROOT_DIR');
    this.joinDir('HARLEM_TEXT_A_DIR', 'CACHE_DIR');
    this.joinDir('HARLEM_TEXT_R_DIR', 'CACHE_DIR');
    this.joinDir('MISSION_DIR', 'CACHE_DIR');
    this.joinDir('QUEST_NAME_TEXT_DIR', 'CACHE_DIR');
    this.joinDir('EVENT_ARC_DIR', 'CACHE_DIR');
    this.joinDir('ICO_DIR', 'CACHE_DIR');
    this.joinDir('PLAYER_DOT_DIR', 'CACHE_DIR');
    this.joinDir('ENEMY_DOT_DIR', 'CACHE_DIR');
    this.joinDir('BATTLE_TALK_EVENT_DIR', 'CACHE_DIR');
    this.joinDir('MAP_DIR', 'CACHE_DIR');
    this.joinDir('MESSAGE_TEXT_DIR', 'CACHE_DIR');
    this.joinDir('ENEMY_DIR', 'CACHE_DIR');
    this.ensureDirs();

    this.setDefault('PORT', '4000');
    this.setDefault('MONGO_HOST', 'localhost');
    this.setDefault('MONGO_PORT', '27017');
    this.setDefault('MONGO_DATABASE', 'aigis');

    console.info('Config initialized!');
  }

  ensureDirs() {
    ([
      'FILES_ROOT_DIR',
      'CACHE_DIR',
      'DATA_DIR',
      'HARLEM_TEXT_A_DIR',
      'HARLEM_TEXT_R_DIR',
      'MISSION_DIR',
      'QUEST_NAME_TEXT_DIR',
      'PLAYER_DOT_DIR',
      'ENEMY_DOT_DIR',
      'BATTLE_TALK_EVENT_DIR',
      'MAP_DIR',
      'MESSAGE_TEXT_DIR',
      'ENEMY_DIR',
    ] as Array<keyof Config>).forEach(key => ensureDirSync(this.config[key]));
  }

  setDefault(key: keyof Config, value: string) {
    this.config[key] = this.config[key] || value;
  }

  get(key: keyof Config) {
    return this.config[key];
  }

  private joinDir(dirKey: keyof Config, baseDirKey: keyof Config) {
    if (Consts[dirKey] === this.config[dirKey]) {
      this.config[dirKey] = join(this.config[baseDirKey], Consts[dirKey]!);
    }
  }
}
