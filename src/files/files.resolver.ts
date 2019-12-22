import { Resolver, Query } from '@nestjs/graphql';
import { FileSchema } from './schemas/file.schema';
import { FileListService } from 'data/fileList.service';
import { ConfigService } from 'config/config.service';
import { readdir, stat } from 'fs-extra';
import { join } from 'path';

@Resolver(FileSchema)
export class FilesResolver {
  constructor(
    private readonly fileList: FileListService,
    private readonly config: ConfigService,
  ) {}

  @Query(returns => [FileSchema])
  Files(): FileSchema[] {
    return this.fileList.data;
  }

  @Query(returns => Date, { nullable: true })
  async UpdateTime() {
    const dataDir = this.config.get('DATA_DIR');
    const fileNames = await readdir(dataDir);
    let date: Date | null = null;
    for (const fileName of fileNames) {
      const filePath = join(dataDir, fileName);
      const st = await stat(filePath);
      if (!st.isDirectory() && (!date || st.ctime > date)) {
        date = st.ctime;
      }
    }
    return date;
  }
}
