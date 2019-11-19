import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ConfigService {
  private readonly config: Record<string, any>;

  constructor(filePath: string) {
    this.config = JSON.parse(
      readFileSync(join(filePath, 'config.json'), 'utf-8'),
    );
  }

  get(key: string) {
    return this.config[key];
  }
}
