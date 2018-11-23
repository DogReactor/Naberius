import { Context } from 'koa';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dbs from '../graphql/dataFiles';
import * as crypto from 'crypto';
import { DATA_DIR } from '../consts';
import MutationResolver from '../graphql/resolvers/MutationResolver';

function md5hex(str: string | Buffer) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

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
      await fs.copy(
        path.join(DATA_DIR, 'FileList.json'),
        path.join(DATA_DIR, 'FileListTmp.json'),
      );
      // }
      await Promise.all([
        writeFile('FileList.json', files.FileListR),
        writeFile('FileListA.json', files.FileListA),
        writeFile('CardList.json', files.CardList),
        writeFile('QuestList.json', files.QuestList),
      ]);
      // overwrite old if md5 not match
      if (
        md5hex(fs.readFileSync(path.join(DATA_DIR, 'FileList.json'))) !==
        md5hex(fs.readFileSync(path.join(DATA_DIR, 'FileListTmp.json')))
      ) {
        fs.copyFileSync(
          path.join(DATA_DIR, 'FileListTmp.json'),
          path.join(DATA_DIR, 'FileListOld.json'),
        );
      }
      dbs.fileList.read();
      dbs.fileListA.read();
      dbs.cardList.read();
      dbs.questListOrigin.read();
      MutationResolver.downloadFiles();
    }
  } else {
    ctx.status = 400;
    ctx.body = 'File(s) missing!';
    return;
  }
  ctx.body = 'OK';
};
