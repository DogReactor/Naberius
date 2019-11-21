import { Resolver, Query } from '@nestjs/graphql';
import { FileSchema } from './schemas/file.schema';
import { File } from 'data/models/file.model';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';

@Resolver(FileSchema)
export class FilesResolver {
  constructor(
    @Inject('FileList') private readonly fileList: DataFileService<File>,
  ) {}

  @Query(returns => [FileSchema])
  files(): FileSchema[] {
    return this.fileList.data;
  }
}
