import { Injectable } from '@nestjs/common';
import { FileListService } from './fileList.service';
import { ConfigService } from 'config/config.service';
import { RequestService } from 'common/request.service';
import { join } from 'path';
import { writeFile, pathExists, readFile } from 'fs-extra';
import { Message } from './models/message.model';

@Injectable()
export class MessageTextService {
  private cache: { [MissionID: number]: Message[] } = {};
  constructor(
    private readonly files: FileListService,
    private readonly request: RequestService,
    private readonly config: ConfigService,
  ) {}

  async get(MissionID: number): Promise<Message[]> {
    if (this.cache[MissionID]) {
      return this.cache[MissionID];
    }
    const fileName = `MessageText${MissionID}`;
    const filePath = join(
      this.config.get('MESSAGE_TEXT_DIR'),
      fileName + '.json',
    );

    if (!(await pathExists(filePath))) {
      const file = this.files.data.find(f => f.Name === fileName + '.atb');
      if (!file) {
        throw Error(`File ${fileName + '.atb'} not found!`);
      }
      const data = await this.request.requestALTB(file.Name);
      if (data !== true) {
        await writeFile(filePath, JSON.stringify(data));
      }
    }

    return (this.cache[MissionID] = JSON.parse(
      await readFile(filePath, 'utf-8'),
    ));
  }
}
