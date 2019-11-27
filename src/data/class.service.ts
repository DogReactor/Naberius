import { Injectable, Inject } from '@nestjs/common';
import { CacheFileService } from './cacheFile.service';
import { ALAR, parseAL, ALTB } from 'aigis-fuel';
import { writeFile } from 'fs-extra';
import { RequestService } from 'common/request.service';
import { ConfigService } from 'config/config.service';
import { join } from 'path';
import { Class } from './models/class.model';

@Injectable()
export class ClassDataService extends CacheFileService<Class> {
  constructor(request: RequestService, config: ConfigService) {
    super(request);
    this.setFilePath(join(config.get('CACHE_DIR'), 'ClassData.json'));
  }
  async update() {
    this.data = ((parseAL(
      await this.request.requestFile('PlayerUnitTable.aar'),
    ) as ALAR).Files.find(file => file.Name === 'ClassData.atb')!
      .Content as ALTB).Contents;
    await writeFile(this.filePath, JSON.stringify(this.data));
  }
}
