import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Consts } from './consts';
import { Config } from './config.model';

@Injectable()
export class ConfigService {
  private readonly config: Config;

  constructor(filePath: string) {
    this.config = {
      ...JSON.parse(readFileSync(join(filePath, 'config.json'), 'utf-8')),
      ...Consts,
    };
  }

  get(key: keyof Config) {
    return this.config[key];
  }
}
