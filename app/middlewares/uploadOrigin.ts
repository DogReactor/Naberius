import { Context } from 'koa';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dbs from '../graphql/dataFiles';
import { DATA_DIR } from '../consts';
import MutationResolver from '../graphql/resolvers/MutationResolver';

async function writeFile(filename: string, file: any) {
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(DATA_DIR, filename));
    reader.pipe(stream);
    stream.on('finish', () => {
      resolve();
    });
  });
}

export default async (ctx: Context, next: any) => {
  if (ctx.method !== 'POST') {
    return next();
  }
  // const files = ctx.request.files;
  if (ctx.request.files) {
    const files = ctx.request.files;
    if (
      files.FileListR &&
      files.FileListA &&
      files.CardList &&
      files.QuestList
    ) {
      // copy old filelist for diff
      const filelistStat = await fs.stat(path.join(DATA_DIR, 'FileList.json'));
      if (
        Math.abs(filelistStat.ctime.getTime() - new Date().getTime()) /
          1000 /
          3600 /
          24 >=
        4
      ) {
        await fs.copy(
          path.join(DATA_DIR, 'FileList.json'),
          path.join(DATA_DIR, 'FileListOld.json'),
        );
      }
      await Promise.all([
        writeFile('FileList.json', files.FileListR),
        writeFile('FileListA.json', files.FileListA),
        writeFile('CardList.json', files.CardList),
        writeFile('QuestList.json', files.QuestList),
      ]);
      dbs.fileList.read();
      dbs.fileListA.read();
      dbs.cardList.read();
      dbs.questListOrigin.read();
      MutationResolver.downloadFiles();
    }
  }
  ctx.body = 'OK';
};
