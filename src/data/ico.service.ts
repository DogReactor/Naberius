import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR, ALTX } from 'aigis-fuel';
import { ALTXExtractPNG } from 'common/utils';
import { join } from 'path';
import { ensureDirSync } from 'fs-extra';
import { ParsedConfigService } from 'config/config.service';
import { Repository } from 'typeorm';
import { File } from './models/file.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IcoService {
  constructor(
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
  ) {}
  async update() {
    try {
      await Promise.all(
        (await this.files.find({where: { Name: /ico_0[0-3]_\d\d\.aar/ }}))
        .map(async item => {
          const aar = await this.request.requestFile(item.Name);
          const parsed = parseAL(aar) as ALAR;
          const dir = join(this.config.get('ICO_DIR'), item.Name.substring(5,6));
          ensureDirSync(dir);
          parsed.Files.forEach(file => {
            const atx = file.Content as ALTX;
            Object.keys(atx.Sprites).forEach(key => {
              const sprite = atx.Sprites[Number.parseInt(key, 10)][0];
              if (sprite.Width > 0 && sprite.Height > 0) {
                const modKey = Number.parseInt(key, 10) & 0x1fff;
                ALTXExtractPNG(atx,
                  sprite.X, sprite.Y, sprite.Width, sprite.Height)
                .toFile(join(dir, `${modKey}.png`));
              }
            });
          });
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
}
