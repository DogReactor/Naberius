import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { parseAL, ALTB } from 'aigis-fuel';
import { DataService } from './data.service';
import { FileListService } from './fileList.service';
import { RequestService } from 'common/request.service';
import { writeFile } from 'fs-extra';
import { ConfigService } from 'config/config.service';
import { join, parse } from 'path';

@Injectable()
export class MissionConfigService {
  constructor(
    private readonly files: FileListService,
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) {}

  async update() {
    await Promise.all(
      this.files.data
        .filter(
          file =>
            (file.Name.includes('MissionConfig.atb') &&
              file.Name !== 'EmcMissionConfig.atb') ||
            file.Name.includes('MissionQuestList.atb'),
        )
        .map(async file => {
          const data = await this.request.requestALTB(file.Name);
          const nameParsed = parse(file.Name);
          await writeFile(
            join(this.config.get('MISSION_DIR'), nameParsed.name + '.json'),
            data,
          );
        }),
    );
  }
}
