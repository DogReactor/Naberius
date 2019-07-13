import { Context } from 'koa';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dbs from '../graphql/dataFiles';
import { DATA_DIR } from '../consts';
import { logger } from '../logger';
import MutationResolver from '../graphql/resolvers/MutationResolver';

async function writeFile(filename: string, file: any) {
  if (typeof file === 'string') {
    return fs.writeFile(path.join(DATA_DIR, filename), file);
  }
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(DATA_DIR, filename));
    reader.pipe(stream);
    stream.on('finish', () => {
      resolve();
    });
  });
}

interface File {
  Link: string;
  Name: string;
}

function isEqual(a: File[], b: File[]) {
  for (const file of a) {
    if (b.find(file2 => file2.Name === file.Name && file2.Link === file.Link)) {
      continue;
    }
    return false;
  }
  for (const file of b) {
    if (a.find(file2 => file2.Name === file.Name && file2.Link === file.Link)) {
      continue;
    }
    return false;
  }
  return true;
}

export default async (ctx: Context, next: any) => {
  if (ctx.method !== 'POST') {
    return next();
  }

  if (ctx.request.files) {
    const files = ctx.request.files;
    if (
      files.FileListR &&
      files.FileListA &&
      files.CardList &&
      files.QuestList
    ) {
      // file upload
      await Promise.all([
        writeFile('FileListTmp.json', files.FileListR),
        writeFile('FileListA.json', files.FileListA),
        writeFile('CardList.json', files.CardList),
        writeFile('QuestList.json', files.QuestList),
      ]);
    } else {
      if (ctx.request.body) {
        const { FileListR, FileListA, CardList, QuestList } = ctx.request
          .body as any;
        if (FileListR && FileListA && CardList && QuestList) {
          await Promise.all([
            writeFile('FileListTmp.json', FileListR),
            writeFile('FileListA.json', FileListA),
            writeFile('CardList.json', CardList),
            writeFile('QuestList.json', QuestList),
          ]);
        } else {
          ctx.status = 400;
          ctx.body = 'File(s) missing!';
          return;
        }
      } else {
        ctx.status = 400;
        ctx.body = 'No body!';
        return;
      }
    }
  } else {
    ctx.status = 400;
    ctx.body = 'No files uploaded!';
    return;
  }
  logger.info('File uploaded');
  // overwrite old if md5 not match
  if (
    !fs.existsSync(path.join(DATA_DIR, 'FileList.json')) ||
    !isEqual(
      JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'FileList.json'), 'utf-8'),
      ),
      JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'FileListTmp.json'), 'utf-8'),
      ),
    )
  ) {
    logger.info('Newer file detected, updating...');
    // copy now to old
    fs.copyFileSync(
      path.join(DATA_DIR, 'FileList.json'),
      path.join(DATA_DIR, 'FileListOld.json'),
    );

    // copy new to now
    fs.copyFileSync(
      path.join(DATA_DIR, 'FileListTmp.json'),
      path.join(DATA_DIR, 'FileList.json'),
    );

    dbs.fileList.read();
    dbs.fileListOld.read();
    dbs.fileListA.read();
    dbs.cardList.read();
    dbs.questListOrigin.read();
    MutationResolver.downloadFiles();
  } else {
    logger.info('File not changed');
  }
  ctx.body = 'OK';
};
