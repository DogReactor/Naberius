import { Injectable } from '@nestjs/common';
import { FileListService } from './fileList.service';
import { ConfigService } from 'config/config.service';
import { RequestService } from 'common/request.service';
import { join } from 'path';
import { writeFile, pathExists, readFile } from 'fs-extra';
import { Enemy } from './models/enemy.model';

@Injectable()
export class EnemyService {
  private cache: { [MissionID: number]: Enemy[] } = {};
  constructor(
    private readonly files: FileListService,
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) {}

  async get(MissionID: number): Promise<Enemy[]> {
    if (this.cache[MissionID]) {
      return this.cache[MissionID];
    }
    const fileName = `Enemy${MissionID}.atb`;
    const filePath = join(this.config.get('ENEMY_DIR'), MissionID + '.json');
    if (!(await pathExists(filePath))) {
      const file = this.files.data.find(f => f.Name === fileName);
      if (!file) {
        throw Error(`File ${fileName} not found!`);
      }
      const data = await this.request.requestALTB(file.Name);
      if (data !== true) {
        await writeFile(filePath, JSON.stringify(data));
      }
    }

    return (this.cache[MissionID] = JSON.parse(
      await readFile(filePath, 'utf-8'),
    ));
  }
}
