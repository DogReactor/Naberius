import { Injectable, Inject } from '@nestjs/common';
import { DataService } from './data.service';
import { RequestService } from 'common/request.service';
import { parse } from 'path';
import { writeFile } from 'fs-extra';

@Injectable()
export class CacheFileService<T> extends DataService<T> {
  constructor(protected readonly request: RequestService) {
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
    this.data = await this.request.requestALTB(assetFileName);
    await writeFile(this.filePath, JSON.stringify(this.data));
  }
}
