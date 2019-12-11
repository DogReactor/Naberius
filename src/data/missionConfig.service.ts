import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { FileListService } from './fileList.service';
import { RequestService } from 'common/request.service';
import { writeFile, readdir, readFile } from 'fs-extra';
import { ConfigService } from 'config/config.service';
import { join, parse } from 'path';
import { Mission } from './models/missionConfig.model';
import { MissionQuest } from './models/missionQuest.model';
import { MissingSubscriptionTopicsError } from 'type-graphql';
import { EventNameText } from './models/eventNameText.model';

@Injectable()
export class MissionConfigService {
  configs: Mission[] = [];
  missionQuests: MissionQuest[] = [];
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

  getQuestIDs(MissionID: number) {
    return this.missionQuests
      .filter(mq => mq.MissionID === MissionID)
      .map(mq => mq.QuestID);
  }

  getMissionByQuestID(QuestID: number) {
    const missionQuest = this.missionQuests.find(mq => mq.QuestID === QuestID);
    if (missionQuest) {
      return this.getMissionByID(missionQuest.MissionID);
    }
  }

  async read() {
    const dir = this.config.get('MISSION_DIR');

    const eventNameTexts: EventNameText[] = JSON.parse(
      await readFile(join(dir, 'EventNameText.json'), 'utf-8'),
    );

    const configFiles = (await readdir(dir)).filter(name =>
      name.includes('MissionConfig'),
    );
    for (const fileName of configFiles) {
      const missions: Mission[] = JSON.parse(
        await readFile(join(dir, fileName), 'utf-8'),
      );

      for (const config of missions) {
        if (config.QuestID) {
          // fuck daily reproduce missions
          this.missionQuests.push(
            ...config.QuestID.split(',').map(idStr => ({
              MissionID: config.MissionID,
              QuestID: Number.parseInt(idStr, 10),
            })),
          );
          config.Name = eventNameTexts[config.TitleID!].Data_Text;
        }
      }

      this.configs.push(
        ...missions.map(mission => ({
          ...mission,
          Type: fileName.replace('MissionConfig.json', ''),
        })),
      );
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
    await this.read();
  }
}
