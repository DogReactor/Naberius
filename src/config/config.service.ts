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
    this.joinDir('CACHE_DIR', 'CACHE_DIR');
    this.joinDir('HARLEM_TEXT_A_DIR', 'CACHE_DIR');
    this.joinDir('HARLEM_TEXT_R_DIR', 'CACHE_DIR');
    this.joinDir('MISSION_DIR', 'CACHE_DIR');
    this.joinDir('NAME_TEXT_DIR', 'CACHE_DIR');
    this.joinDir('EVENT_ARC_DIR', 'CACHE_DIR');
    this.joinDir('ICO_DIR', 'STATIC_DIR');
    this.joinDir('PLAYERDOT_IMG_DIR', 'STATIC_DIR');
    this.joinDir('PLAYERDOT_INFO_DIR', 'CACHE_DIR');
    this.ensureDirs();
    console.info('Config initialized!');
  }

  ensureDirs() {
    ([
      'FILES_ROOT_DIR',
      'CACHE_DIR',
      'DATA_DIR',
      'STATIC_DIR',
      'HARLEM_TEXT_A_DIR',
      'HARLEM_TEXT_R_DIR',
      'MISSION_DIR',
      'NAME_TEXT_DIR',
      'PLAYERDOT_IMG_DIR',
      'PLAYERDOT_INFO_DIR',
    ] as Array<keyof Config>).forEach(key => ensureDirSync(this.config[key]));
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
