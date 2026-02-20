import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Consts } from './consts';
import { Config } from './config.model';
import { ensureDirSync } from 'fs-extra';
import { Logger } from 'logger/logger.service';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ParsedConfigService {
  private readonly config: Config;

  constructor(
    private readonly logger: Logger,
    private readonly configs: NestConfigService,
  ) {
    this.logger.setContext('ConfigService');
    this.config = {
      FILES_ROOT_DIR: configs.get('FILES_ROOT_DIR', '.'),
      MONGO_HOST: configs.get('MONGO_HOST', 'localhost'),
      MONGO_PORT: configs.get('MONGO_PORT', '27017'),
      MONGO_DATABASE: configs.get('MONGO_DATABASE', 'aigis'),
      PORT: configs.get('PORT', '4000'),
      ...Consts,
    } as Config;
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
    this.joinDir('POSTER_DIR', 'CACHE_DIR');
    this.joinDir('BANNER_DIR', 'CACHE_DIR');
    this.joinDir('PLAYER_STAND_CG_DIR', 'CACHE_DIR');
    this.joinDir('PLAYER_HARLEM_CG_DIR', 'CACHE_DIR');
    this.joinDir('SKIN_ICO_DIR', 'CACHE_DIR');
    this.joinDir('SKIN_CG_DIR', 'CACHE_DIR');
    this.joinDir('SKIN_DOT_DIR', 'CACHE_DIR');
    this.joinDir('DB_CACHE_DIR', 'CACHE_DIR')
    this.ensureDirs();

    this.logger.log('Config initialized!');
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
      'POSTER_DIR',
      'BANNER_DIR',
      'PLAYER_STAND_CG_DIR',
      'PLAYER_HARLEM_CG_DIR',
      'SKIN_ICO_DIR',
      'SKIN_CG_DIR',
      'SKIN_DOT_DIR',
      'DB_CACHE_DIR',
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
