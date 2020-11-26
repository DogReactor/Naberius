import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { RequestService } from 'common/request.service';
import { writeFile, readdir, readFile } from 'fs-extra';
import { ParsedConfigService } from 'config/config.service';
import { join, parse } from 'path';
import { Mission } from './models/missionConfig.model';
import { MissionQuest } from './models/missionQuest.model';
import { EventNameText } from './models/eventNameText.model';
import { Repository } from 'typeorm';
import { File } from './models/file.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MissionConfigService {
  configs: Mission[] = [];
  missionQuests: MissionQuest[] = [];
  constructor(
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
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
    this.configs = [];
    const dir = this.config.get('MISSION_DIR');

    try {
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
    } catch (err) {
      console.info(err, 'can be ignored')
    }
  }

  async update() {
    await Promise.all(
      (
        await this.files.find({
          where: {
            $or: [
              {
                $and: [
                  { Name: /MissionConfig\.atb/ },
                  { Name: { $not: /EmcMissionConfig\.atb/ } },
                ],
              },
              { Name: /MissionQuestList\.atb/ },
              { Name: /EventNameText\.atb/ },
            ],
          },
        })
      ).map(async file => {
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
