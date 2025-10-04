import { Injectable } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR, ALTX } from 'aigis-fuel';
import { ALTX2PNG } from 'common/utils';
import { join } from 'path';
import { ensureDirSync } from 'fs-extra';
import { ParsedConfigService } from 'config/config.service';

@Injectable()
export class IcoService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
  ) {}
  async update() {
    try {
      await Promise.all([
        this.request.requestFile('ico_00.aar'),
        this.request.requestFile('ico_01.aar'),
        this.request.requestFile('ico_02.aar'),
        this.request.requestFile('ico_03.aar'),
      ]).then(res => {
        res.forEach((aar, index) => {
          const parsed = parseAL(aar) as ALAR;
          const dir = join(this.config.get('ICO_DIR'), index.toString());
          ensureDirSync(dir);
          parsed.Files.forEach(file => {
            const atx = file.Content as ALTX;
            const image = ALTX2PNG(atx);
            Object.keys(atx.Sprites).forEach(key => {
              const sprite = atx.Sprites[Number.parseInt(key, 10)][0];
              if (sprite.Width !== 0 && sprite.Height !== 0) { 
                const modKey = Number.parseInt(key, 10) % 8192;
                image
                  .extract({
                    left: sprite.X,
                    top: sprite.Y,
                    width: sprite.Width,
                    height: sprite.Height,
                  })
                  .toFile(join(dir, `${modKey}.png`));
              }
            });
          });
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
}
