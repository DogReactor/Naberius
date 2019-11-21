import { Injectable, Inject } from '@nestjs/common';
import { DataService } from './data.service';
import { File } from './models/file.model';
import { DataFileService } from './dataFile.service';
import { RequestService } from 'common/request.service';
import { parse } from 'path';
import { writeFile } from 'fs-extra';
import { ConfigService } from 'config/config.service';

@Injectable()
export class CacheFileService<T> extends DataService<T> {
  fileURL?: string;

  constructor(
    @Inject('FileList') private readonly fileList: DataFileService<File>,
    private readonly request: RequestService,
  ) {
    super();
  }

  setFilePath(filePath: string) {
    this.filePath = filePath;
    this.read();
  }

  /**
   * Update locale file
   */
  async update() {
    const parsedPath = parse(this.filePath);
    const assetFileName = parsedPath.name + '.atb';
    const file = this.fileList.data.find(f => f.Name === assetFileName);
    if (file) {
      this.data = await this.request.requestALTB(file.Link, assetFileName);
      await writeFile(this.filePath, JSON.stringify(this.data));
    } else {
      throw Error(`No such file in fileList: ` + assetFileName);
    }
  }
}
