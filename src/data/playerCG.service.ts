import { Injectable, Inject } from '@nestjs/common';
import { ALTX, parseAL } from 'aigis-fuel';
import { RequestService } from 'common/request.service';
import { ALTX2PNG, numberPadding } from 'common/utils';
import { ParsedConfigService } from 'config/config.service';
import { Repository } from 'typeorm';
import { File } from 'data/models/file.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'logger/logger.service';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class PlayerCGService {
  constructor(
    private readonly request: RequestService,
    private readonly config: ParsedConfigService,
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly logger: Logger,
  ) {}
  async get(CardID: number, type: 'Stand' | 'Harlem') {
    const imgPath = path.join(
      this.config.get(
        type === 'Stand' ? 'PLAYER_STAND_CG_DIR' : 'PLAYER_HARLEM_CG_DIR',
      ),
    );
    const CardIDPadded3 = numberPadding(CardID, 3);
    const CardIDPadded4 = numberPadding(CardID, 4);
    let aarFileName : string;
    if (type === 'Stand') {
        // assume one ALAR file contains all StandCGs.
        const fileNamePrefix = 'Card' + CardIDPadded4 + '_';
        let fileName : string;
        let file : any;
        let idx = 3;
        do {
            fileName = fileNamePrefix + idx + '.aar';
            file = await this.files.findOne({ Name: fileName });
            idx--;
        } while (!file && idx >= 0);
        if (!file) {
            return [];
        }
        aarFileName = fileName;
    } else {
        aarFileName = 'HarlemCG' + CardIDPadded4 + '.aar';
    }

    // 获取文件列表
    const getFilelist = async () => {
      const fileList = await fs.readdir(imgPath);
      if (type === 'Stand') {
        return fileList
          .filter(name => name.match(RegExp(`${CardIDPadded3}_card_\\d.png`)))
          .sort();
      } else {
        return fileList
          .filter(name =>
            name.match(RegExp(`HarlemCG_${CardIDPadded3}_\\d.png`)),
          )
          .sort();
      }
    };

    // 如果已经有图了就直接返回
    const fileList = await getFilelist();
    if (fileList.length !== 0) {
      return fileList;
    }

    // 下载图
    try {
      const aarFile = parseAL(await this.request.requestFile(aarFileName));
      for (const file of aarFile.Files) {
        const txName = file.Name.split('.');
        if (txName[1] === 'atx' && file.Content) {
          const content = file.Content as ALTX;
          await ALTX2PNG(content).toFile(
            path.join(imgPath, txName[0] + '.png'),
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
}
