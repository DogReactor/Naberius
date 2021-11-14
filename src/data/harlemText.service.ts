import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR, ALTB } from 'aigis-fuel';
import { writeFile, readdirSync, readFileSync, existsSync } from 'fs-extra';
import { ParsedConfigService } from 'config/config.service';
import { join } from 'path';

@Injectable()
export class HarlemTextService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
  ) {}

  async update() {
    // cg1, cg2 (text files)
    [
      { name: 'HarlemText.aar', dir: 'HARLEM_TEXT_R_DIR' },
      { name: 'HarlemEventText0.aar', dir: 'HARLEM_TEXT_A_DIR' },
      { name: 'HarlemEventText1.aar', dir: 'HARLEM_TEXT_A_DIR' },
    ].forEach(async item =>
      (parseAL(
        await this.request.requestFile(item.name),
      ) as ALAR).Files.forEach(file =>
        writeFile(
          join(this.config.get(item.dir as any), file.Name),
          file.Content.Buffer,
        ),
      ),
    );

    // cg3
    [
      { name: 'prev03.aar', dir: 'HARLEM_TEXT_R_DIR' },
      { name: 'paev03.aar', dir: 'HARLEM_TEXT_A_DIR' },
    ].forEach(async item =>
      (parseAL(
        await this.request.requestFile(item.name),
      ) as ALAR).Files.forEach(evaarFile => {
        const match = /(?<=ev)\d+(?=\.aar)/.exec(evaarFile.Name);
        const evaar = evaarFile.Content as ALAR;
        if (match) {
          const CardID = Number.parseInt(match[0], 10);
          evaar.Files.forEach(atb => {
            if (atb.Name.includes('evtxt')) {
              writeFile(
                join(this.config.get(item.dir as any), `Text${CardID}.json`),
                JSON.stringify(atb.Content.Contents),
              );
            }
          });
        }
      }),
    );
  }

  get(CardID: number | string, type: 'A' | 'R') {
    const dir = this.config.get(
      type === 'A' ? 'HARLEM_TEXT_A_DIR' : 'HARLEM_TEXT_R_DIR',
    );

    // cg1, cg2
    const texts = readdirSync(dir)
      .filter(filename => filename.match(`.*Text_0*${CardID}_\\d\\.txt`))
      .map(filename => readFileSync(join(dir, filename), 'utf-8'));

    // cg3
    const cg3FilePath = join(dir, `Text${CardID}.json`);
    if (existsSync(cg3FilePath)) {
      texts.push(
        JSON.parse(readFileSync(cg3FilePath, 'utf-8'))
          .map((text: any) =>
            text._TalkerName
              ? `@${text._TalkerName}\n${text._TalkText}`
              : text._TalkText,
          )
          .join('\n\n')
          .replace(/\n/g, '\r\n'),
      );
    }

    return texts;
  }
}
