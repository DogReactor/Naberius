import { Injectable } from '@nestjs/common';
import { DataService } from './data.service';
import { File } from './models/file.model';
import { ConfigService } from 'config/config.service';
import { join } from 'path';
import { readFile } from 'fs-extra';

@Injectable()
export class FileListService extends DataService<File> {
  constructor(private readonly config: ConfigService) {
    super();
    this.read();
  }

  async read() {
    const filePath = join(this.config.get('DATA_DIR'), 'FileList.json');
    const filePathA = join(this.config.get('DATA_DIR'), 'FileListA.json');
    const data: File[] = JSON.parse(await readFile(filePath, 'utf-8'));
    const dataA: File[] = JSON.parse(await readFile(filePathA, 'utf-8'));
    this.data = [...data, ...dataA];
  }
}
