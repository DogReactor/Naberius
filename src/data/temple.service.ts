import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR, ALTX } from 'aigis-fuel';
import { ALTX2PNG } from 'common/utils';
import { join } from 'path';

@Injectable()
export class TempleService {
  constructor(
    private readonly config: ConfigService,
    private readonly request: RequestService,
  ) {}

  async update() {
    const aar = await this.request.requestFile('TempleTopMenu.aar');
    const parsedFile = parseAL(aar) as ALAR;
    for (const file of parsedFile.Files) {
      if (file.Name.includes('.atx')) {
        const atx = file.Content as ALTX;
        const image = ALTX2PNG(atx);
        Object.keys(atx.Sprites).forEach(key => {
          const ft = atx.Sprites[Number.parseInt(key, 10)];
          const name = ft.name;
          if (name?.includes('temple_banner')) {
            const sprite = ft[0];
            if (
              sprite.Width !== 0 &&
              sprite.Width !== 1 &&
              sprite.Height !== 0 &&
              sprite.Height !== 1
            ) {
              image
                .extract({
                  left: sprite.X,
                  top: sprite.Y,
                  width: sprite.Width,
                  height: sprite.Height,
                })
                .toFile(
                  join(this.config.get('TEMPLE_DIR'), `${name.trim()}.png`),
                );
            }
          }
        });

        break;
      }
    }
  }
}
