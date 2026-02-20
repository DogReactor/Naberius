import { Injectable, Inject } from '@nestjs/common';
import { RequestService } from 'common/request.service';
import { parseAL, ALAR, ALTX } from 'aigis-fuel';
import { ALTXExtractPNG } from 'common/utils';
import { join } from 'path';
import { ensureDirSync, readdir, writeFile } from 'fs-extra';
import { ParsedConfigService } from 'config/config.service';
import { Repository } from 'typeorm';
import { File } from 'data/models/file.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ALTX2PNG, numberPadding } from 'common/utils';
import { Logger } from 'logger/logger.service';
import { Skin } from './models/skin.model';
import { SkinUnitMap } from 'data/models/skinUnitMap.model';
import { ALTB } from 'aigis-fuel';
import { CacheFileService } from './cacheFile.service';

@Injectable()
export class SkinService extends CacheFileService<Skin> {
  constructor(
    request: RequestService,
    private readonly config: ParsedConfigService,
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly logger: Logger,
  ) {
    super(request);
    this.setFilePath(join(config.get('CACHE_DIR'), 'SkinPackage.json'));
  }
  
  //TODO impl fetching SP version CG
  async getCG(skinIndex: number) {
    const imgPath = this.config.get('SKIN_CG_DIR');
    const CardIDPadded3 = numberPadding(skinIndex, 3);

    // 获取文件列表
    const getFilelist = async () => {
      const fileList = await readdir(imgPath);
      return fileList
        .filter(name => name.match(RegExp(`${CardIDPadded3}_card_0.png`)))
        .sort();
    };

    // 如果已经有图了就直接返回
    const fileList = await getFilelist();
    if (fileList.length !== 0) {
      return fileList;
    }

    // 下载图
    const CardIDPadded4 = numberPadding(skinIndex, 4);
    const aarFileName = `SkinCard${CardIDPadded4}_0.aar`
    try {
      const aarFile = parseAL(await this.request.requestFile(aarFileName));
      for (const file of aarFile.Files) {
        const txName = file.Name.split('.');
        if (txName[1] === 'atx' && file.Content) {
          const content = file.Content as ALTX;
          await ALTX2PNG(content).toFile(
            join(imgPath, txName[0] + '.png'),
          );
        }
      }
    } catch (err) {
      const error = err as Error;
      this.logger.error(error.message);
      return [];
    }

    // 重新获取一次
    return await getFilelist();
  }

  async update() {
    try {
      const ctx = (parseAL(
            await this.request.requestFile('SkinPackage.atb'),
          ) as ALTB).Contents;
      if (!Array.isArray(ctx)) {
        throw Error('SkinPackage malformed.');
      }
      for (let i = 0; i < ctx.length; ++i) {
        this.data.push({rowid: i+1, ...ctx[i]});
      }
      await writeFile(this.filePath, JSON.stringify(this.data));

      this.request.requestFile('skin_ico_00.aar')
      .then(aar => {
        const parsed = parseAL(aar) as ALAR;
        const dir = this.config.get('SKIN_ICO_DIR');
        ensureDirSync(dir);
        parsed.Files.forEach(file => {
          const atx = file.Content as ALTX;
          Object.keys(atx.Sprites).forEach(key => {
            const sprite = atx.Sprites[Number.parseInt(key, 10)][0];
            if (sprite.Width !== 0 && sprite.Height !== 0) {
              const modKey = Number.parseInt(key, 10) & 0xffff;
              ALTXExtractPNG(atx,
                       sprite.X, sprite.Y, sprite.Width, sprite.Height)
              .toFile(join(dir, `${modKey}.png`));
            }
          });
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
}
