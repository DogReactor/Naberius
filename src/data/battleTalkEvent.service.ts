import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { join } from 'path';
import { ensureDir, pathExists, writeFile, readFile } from 'fs-extra';
import { parseAL, ALAR, ALTX, ALTB } from 'aigis-fuel';
import { RequestService } from 'common/request.service';
import { ALTX2PNG } from 'common/utils';
import { BattleTalkEvent } from './models/battleTalkEvent.model';

@Injectable()
export class BattleTalkEventService {
  constructor(
    private readonly config: ConfigService,
    private readonly request: RequestService,
  ) {}
  async get(MissionID: number) {
    const talkPath = join(
      this.config.get('BATTLE_TALK_EVENT_DIR'),
      MissionID.toString(),
    );

    const infoPath = join(talkPath, 'info.json');

    if (!(await pathExists(talkPath))) {
      await ensureDir(talkPath);
      const aarFile = parseAL(
        await this.request.requestFile(`BattleTalkEvent${MissionID}.aar`),
      ) as ALAR;
      for (const file of aarFile.Files) {
        if (file.Name === 'FaceIcon.atx') {
          const atx = file.Content as ALTX;
          const image = ALTX2PNG(atx);
          Object.keys(atx.Sprites).forEach((key: string) => {
            const sprite = atx.Sprites[Number.parseInt(key, 10)][0];
            if (sprite.Width !== 0 && sprite.Height !== 0) {
              const name = Number.parseInt(
                atx.Sprites[Number.parseInt(key, 10)].name || key,
                10,
              );
              image
                .extract({
                  left: sprite.X,
                  top: sprite.Y,
                  width: sprite.Width,
                  height: sprite.Height,
                })
                .toFile(join(talkPath, `${name}.png`));
            }
          });
        } else if (file.Name === 'BattleTalkEvent.atb') {
          const atb = file.Content as ALTB;
          await writeFile(infoPath, JSON.stringify(atb.Contents));
        }
      }
    }
    if (await pathExists(infoPath)) {
      const events = JSON.parse(
        await readFile(infoPath, 'utf-8'),
      ) as BattleTalkEvent[];
      let index = -1;
      // sometimes RecordOffset will stick to a non-zero number
      let stopIndex = -1;
      events.forEach(event => {
        if (event.RecordOffset && stopIndex !== event.RecordOffset) {
          index = event.RecordOffset;
          stopIndex = event.RecordOffset;
          event.RecordIndex = event.RecordOffset;
        } else {
          event.RecordIndex = ++index;
        }
      });
      return events;
    }
  }
}
