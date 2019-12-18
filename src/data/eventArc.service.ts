import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR } from 'aigis-fuel';
import { ensureDirSync, writeFile, pathExists, readFile } from 'fs-extra';
import { join, parse } from 'path';
import { ConfigService } from 'config/config.service';
import { EventArc } from './models/eventArc.model';

@Injectable()
export class EventArcService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) {}

  async get(QuestID: number) {
    const filePath = join(
      this.config.get('EVENT_ARC_DIR'),
      QuestID.toString(),
      '_evtxt.json',
    );
    if (await pathExists(filePath)) {
      return JSON.parse(await readFile(filePath, 'utf-8')) as EventArc[];
    }
  }

  async update() {
    (parseAL(
      await this.request.requestFile('EventArc.aar'),
    ) as ALAR).Files.forEach(evaarFile => {
      const evaar = evaarFile.Content as ALAR;
      const match = /(?<=_ev)\d+(?=\.aar)/.exec(evaarFile.Name);
      if (match) {
        const QuestID = Number.parseInt(match[0], 10);
        const dir = join(this.config.get('EVENT_ARC_DIR'), QuestID.toString());
        ensureDirSync(dir);
        evaar.Files.forEach(atbFile => {
          const parsedName = parse(atbFile.Name);
          writeFile(
            join(dir, parsedName.name + '.json'),
            JSON.stringify(atbFile.Content.Contents),
          );
        });
      }
    });
  }
}
