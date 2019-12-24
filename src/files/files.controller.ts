import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConfigService } from 'config/config.service';
import moment = require('moment');
import { join } from 'path';
import { ensureDir, writeFile, remove, readdir } from 'fs-extra';
import { File } from 'data/models/file.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataResolver } from 'data/data.resolver';

@Controller('upload-origin')
export class FilesController {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly data: DataResolver,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'FileListR', maxCount: 1 },
      { name: 'FileListA', maxCount: 1 },
      { name: 'CardList', maxCount: 1 },
      { name: 'QuestList', maxCount: 1 },
    ]),
  )
  async uploadFiles(@UploadedFiles() files: any) {
    if (
      files.FileListR &&
      files.FileListA &&
      files.CardList &&
      files.QuestList
    ) {
      const parsedFiles: any = {};
      Object.keys(files).forEach(
        key => (parsedFiles[key] = JSON.parse(files[key][0].buffer)),
      );

      await Promise.all(
        parsedFiles.FileListR.map(async (file: any) => {
          let dbFile = await this.files.findOne({ Name: file.Name });
          if (!dbFile) {
            dbFile = new File();
            dbFile.Name = file.Name;
          }
          if (dbFile.Link !== file.Link || !dbFile.Link) {
            dbFile.Link = file.Link;
            dbFile.UpdateTime = new Date();
            await this.files.save(dbFile);
          }
        }),
      );

      await Promise.all(
        parsedFiles.FileListA.map(async (file: any) => {
          let dbFile = await this.files.findOne({ Name: file.Name });
          if (!dbFile) {
            dbFile = new File();
            dbFile.Name = file.Name;
          }
          if (dbFile.Link !== file.Link || !dbFile.Link) {
            dbFile.Link = file.Link;
            dbFile.UpdateTime = new Date();
            await this.files.save(dbFile);
          }
        }),
      );

      await Promise.all(
        Object.keys(files).map(key =>
          writeFile(
            join(this.config.get('DATA_DIR'), key + '.json'),
            files[key][0].buffer,
          ),
        ),
      );

      const dir = join(
        this.config.get('DATA_DIR'),
        moment().format('YYYYMMDD'),
      );
      await ensureDir(dir);
      await Promise.all(
        Object.keys(files).map(key =>
          writeFile(join(dir, key + '.json'), files[key][0].buffer),
        ),
      );
      for (const file of await readdir(this.config.get('CACHE_DIR'))) {
        if (file !== 'poster') {
          await remove(join(this.config.get('CACHE_DIR'), file));
        }
      }
      this.config.ensureDirs();
      this.data.UpdateFiles();
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing file(s)',
        },
        400,
      );
    }
    return 'ok';
  }

  @Get()
  test() {
    return 'test';
  }
}
