import { Injectable, Inject } from '@nestjs/common';
import { DataService } from './data.service';

@Injectable()
export class DataFileService<T> extends DataService<T> {
  setFilePath(filePath: string) {
    this.filePath = filePath;
    this.read();
  }
}
