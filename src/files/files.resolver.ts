import { Resolver, Query } from '@nestjs/graphql';
import { ParsedConfigService } from 'config/config.service';
import { readdir, stat } from 'fs-extra';
import { join } from 'path';
import { File } from 'data/models/file.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(File)
export class FilesResolver {
  constructor(
    @InjectRepository(File)
    private readonly files: Repository<File>,
    private readonly config: ParsedConfigService,
  ) {}

  @Query(returns => [File])
  Files() {
    return this.files.find();
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
