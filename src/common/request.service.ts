import { Injectable } from '@nestjs/common';
import * as request from 'request-promise-native';
import { parseAL } from 'aigis-fuel';
import { sleep } from './utils';
import { ConfigService } from 'config/config.service';
import { FileListService } from 'data/fileList.service';

@Injectable()
export class RequestService {
  private downloadings: string[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly files: FileListService,
  ) {}

  async requestFile(fileName: string) {
    const file = this.files.data.find(f => f.Name === fileName);
    if (!file) {
      throw Error("Can't find file: " + fileName);
    }
    if (this.downloadings.find(name => name === fileName)) {
      while (this.downloadings.find(name => name === fileName)) {
        await sleep(1000);
      }
      return true;
    }
    while (true) {
      if (this.downloadings.length < 10) {
        break;
      }
      await sleep(1000);
    }
    this.downloadings.push(fileName);
    console.info(`+${this.downloadings.length} Downloading ${fileName}`);
    for (let retry = 1; retry <= 3; retry++) {
      try {
        const res = await request.get({
          url: this.config.get('ASSETS_BASE_URL') + file.Link,
          encoding: null,
          timeout: 50 * 1000,
          proxy: process.env.proxy,
          gzip: true,
          family: 4,
        });
        console.info(`-${this.downloadings.length} Downloaded ${fileName}!`);
        this.downloadings.splice(
          this.downloadings.findIndex(n => n === fileName),
          1,
        );

        return res;
      } catch (err) {
        console.error(err.stack);
        console.info(
          `=${this.downloadings.length} Failed downloading ${fileName}, retry ${retry}...`,
        );
      }
    }
    console.error(`-${this.downloadings} Failed downloading ${fileName}!`);
    this.downloadings.splice(
      this.downloadings.findIndex(n => n === fileName),
      1,
    );
    throw Error('Download Failed!');
  }

  async requestALTB(fileName: string) {
    return this.requestFile(fileName).then(res => {
      if (res === true) {
        return res;
      }
      const table = parseAL(res);
      return table.Contents;
    });
  }
}
