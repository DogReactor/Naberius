import { Resolver, Query } from '@nestjs/graphql';
import { FileSchema } from './schemas/file.schema';
import { File } from 'data/models/file.model';
import { Inject } from '@nestjs/common';
import { StaticFileService } from 'data/staticFile.service';

@Resolver(FileSchema)
export class FilesResolver {
  constructor(
    @Inject('FileList') private readonly fileList: StaticFileService<File>,
  ) {}

  @Query(returns => [FileSchema])
  files(): FileSchema[] {
    return this.fileList.data;
  }
}
