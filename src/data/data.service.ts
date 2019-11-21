import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { readFile } from 'fs-extra';

@Injectable()
export abstract class DataService<T> {
  data: T[];
  filePath: string;

  async read() {
    if (this.filePath) {
      try {
        this.data = JSON.parse(await readFile(this.filePath, 'utf-8'));
      } catch (err) {
        console.error(err);
        this.data = [];
      }
    } else {
      console.error('FilePath not set!');
      process.exit(1);
    }
  }

  get _() {
    return _.chain(this.data);
  }
}
