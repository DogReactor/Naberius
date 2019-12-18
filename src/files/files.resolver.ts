import { Resolver, Query } from '@nestjs/graphql';
import { FileSchema } from './schemas/file.schema';
import { File } from 'data/models/file.model';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { FileListService } from 'data/fileList.service';

@Resolver(FileSchema)
export class FilesResolver {
  constructor(private readonly fileList: FileListService) {}

  @Query(returns => [FileSchema])
  Files(): FileSchema[] {
    return this.fileList.data;
  }
}
