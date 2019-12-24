import { Injectable } from '@nestjs/common';
import * as request from 'request-promise-native';
import { parseAL } from 'aigis-fuel';
import { sleep } from './utils';
import { ConfigService } from 'config/config.service';
import { EventEmitter } from 'events';
import * as ProgressBar from 'progress';
import * as progress from 'request-progress';
import { Logger } from 'logger/logger.service';
import { Repository } from 'typeorm';
import { File } from 'data/models/file.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequestService extends EventEmitter {
  private downloadings: string[] = [];

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly logger: Logger,
  ) {
    super();
    this.on('download', async (fileName: string) => {
      const file = await this.files.findOne({ Name: fileName });
      if (!file) {
        this.emit(fileName, 'error', Error("Can't find file: " + fileName));
        return;
      }
      if (this.downloadings.find(name => name === fileName)) {
        return;
      }
      while (true) {
        if (this.downloadings.length < 5) {
          break;
        }
        await sleep(Math.floor(Math.random() * 1001));
      }
      this.downloadings.push(fileName);
      for (let retry = 1; retry <= 5; retry++) {
        try {
          const req = request.get({
            url: this.config.get('ASSETS_BASE_URL') + file.Link,
            encoding: null,
            timeout: 50 * 1000,
            proxy: process.env.proxy,
            gzip: true,
            family: 4,
          });

          const bar = new ProgressBar(`${retry} ${fileName} [:bar] :percent`, {
            total: 100,
            width: 20,
          });

          bar.update(0);
          progress(req).on('progress', (state: any) => {
            bar.update(state.percent);
          });

          const res = await req;
          bar.update(1);
          this.logger.log(`Downloaded ${fileName}!`);
          this.downloadings.splice(
            this.downloadings.findIndex(n => n === fileName),
            1,
          );
          this.emit(fileName, 'success', res);
          return;
        } catch (err) {
          this.logger.warn(
            `Failed downloading ${fileName}, retry #${retry}...`,
          );
        }
      }
      this.logger.error(`Failed downloading ${fileName}!`);
      this.downloadings.splice(
        this.downloadings.findIndex(n => n === fileName),
        1,
      );
      this.emit(
        fileName,
        'error',
        new Error("Can't download file: " + fileName),
      );
      return;
    });
  }

  async requestFile(fileName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.once(fileName, (status, res) => {
        if (status === 'success') {
          resolve(res);
        } else {
          reject(res);
        }
      });
      this.emit('download', fileName);
    });
  }

  async requestALTB(fileName: string) {
    return this.requestFile(fileName).then(res => {
      const table = parseAL(res);
      return table.Contents;
    });
  }
}
