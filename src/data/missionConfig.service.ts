import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { parseAL, ALTB } from 'aigis-fuel';
import { DataService } from './data.service';
import { FileListService } from './fileList.service';
import { RequestService } from 'common/request.service';
import { writeFile, readdir, readFile } from 'fs-extra';
import { ConfigService } from 'config/config.service';
import { join, parse } from 'path';
import { MissionConfig } from './models/missionConfig.model';
import { MissionQuest } from './models/missionQuest.model';

@Injectable()
export class MissionConfigService {
  private configs: MissionConfig[] = [];
  private missionQuests: MissionQuest[] = [];
  constructor(
    private readonly files: FileListService,
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) {
    this.read();
  }

  getMissionByID(MissionID: number) {
    return this.configs.find(conf => conf.MissionID === MissionID);
  }

  getMissionByQuestID(QuestID: number) {
    const missionQuest = this.missionQuests.find(mq => mq.QuestID === QuestID);
    if (missionQuest) {
      return this.getMissionByID(missionQuest.MissionID);
    }
  }

  async read() {
    const dir = this.config.get('MISSION_DIR');

    const configFiles = (await readdir(dir)).filter(name =>
      name.includes('MissionConfig'),
    );
    for (const fileName of configFiles) {
      const file: MissionConfig[] = JSON.parse(
        await readFile(join(dir, fileName), 'utf-8'),
      );
      this.configs.push(...file);
      for (const config of file) {
        if (config.QuestID) {
          // fuck daily reproduce missions
          this.missionQuests.push(
            ...config.QuestID.split(',').map(idStr => ({
              MissionID: config.MissionID,
              QuestID: Number.parseInt(idStr, 10),
            })),
          );
        }
      }
    }

    const mqFiles = (await readdir(dir)).filter(name =>
      name.includes('QuestList'),
    );
    for (const fileName of mqFiles) {
      const file = JSON.parse(await readFile(join(dir, fileName), 'utf-8'));
      this.missionQuests.push(...file);
    }
  }

  async update() {
    await Promise.all(
      this.files.data
        .filter(
          file =>
            (file.Name.includes('MissionConfig.atb') &&
              file.Name !== 'EmcMissionConfig.atb') ||
            file.Name.includes('MissionQuestList.atb') ||
            file.Name === 'EventNameText.atb',
        )
        .map(async file => {
          const data = await this.request.requestALTB(file.Name);
          const nameParsed = parse(file.Name);
          await writeFile(
            join(this.config.get('MISSION_DIR'), nameParsed.name + '.json'),
            JSON.stringify(data),
          );
        }),
    );
  }
}
