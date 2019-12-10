import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR } from 'aigis-fuel';
import { ensureDirSync, writeFile } from 'fs-extra';
import { join, parse } from 'path';
import { ConfigService } from 'config/config.service';

@Injectable()
export class EventArcService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) {}

  async update() {
    (parseAL(
      await this.request.requestFile('EventArc.aar'),
    ) as ALAR).Files.forEach(evaarFile => {
      const evaar = evaarFile.Content as ALAR;
      const match = /(?<=_ev)\d+(?=\.aar)/.exec(evaarFile.Name);
      if (match) {
        const questID = Number.parseInt(match[0], 10);
        const dir = join(this.config.get('EVENT_ARC_DIR'), questID.toString());
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
