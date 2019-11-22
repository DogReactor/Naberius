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

    if (Consts.DATA_DIR === this.config.DATA_DIR) {
      this.config.DATA_DIR = join(this.config.FILES_ROOT_DIR, Consts.DATA_DIR);
    }
    if (Consts.CACHE_DIR === this.config.CACHE_DIR) {
      this.config.CACHE_DIR = join(
        this.config.FILES_ROOT_DIR,
        Consts.CACHE_DIR,
      );
    }
    if (Consts.HARLEM_TEXT_A_DIR === this.config.HARLEM_TEXT_A_DIR) {
      this.config.HARLEM_TEXT_A_DIR = join(
        this.config.CACHE_DIR,
        Consts.HARLEM_TEXT_A_DIR,
      );
    }
    if (Consts.HARLEM_TEXT_R_DIR === this.config.HARLEM_TEXT_R_DIR) {
      this.config.HARLEM_TEXT_R_DIR = join(
        this.config.CACHE_DIR,
        Consts.HARLEM_TEXT_R_DIR,
      );
    }

    [
      this.config.FILES_ROOT_DIR,
      this.config.CACHE_DIR,
      this.config.DATA_DIR,
      this.config.HARLEM_TEXT_A_DIR,
      this.config.HARLEM_TEXT_R_DIR,
    ].forEach(path => ensureDirSync(path));

    console.info('Config initialized!');
  }

  get(key: keyof Config) {
    return this.config[key];
  }
}
