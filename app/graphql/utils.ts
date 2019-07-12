import * as request from 'request-promise-native';
import * as _ from 'lodash';
import { parseAL, ALTX } from 'aigis-fuel';
import * as sharp from 'sharp';
import { Stream } from 'stream';
import * as dbs from './dataFiles';
import { logger } from '../logger';
import { BASE_URL } from '../consts';

let downloadNum = 0;

export async function requestFile(filename: string) {
  let file: any = _.find(dbs.fileList.data, { Name: filename });
  if (!file) {
    file = _.find(dbs.fileListA.data, { Name: filename });
  }

  if (file) {
    downloadNum += 1;
    logger.info(`+${downloadNum} Downloading ${file.Name}`);
    for (let retry = 1; retry <= 3; retry++) {
      try {
        const res = await request.get({
          url: BASE_URL + file.Link,
          encoding: null,
          timeout: 50 * 1000,
          proxy: process.env.proxy,
          gzip: true,
          family: 4,
        });
        logger.info(`-${downloadNum} Downloaded ${file.Name}!`);
        downloadNum -= 1;
        return res;
      } catch (err) {
        logger.error(err.stack);
        logger.info(
          `=${downloadNum} Failed downloading ${file.Name}, retry ${retry}...`,
        );
      }
    }
    logger.error(`-${downloadNum} Failed downloading ${file.Name}!`);
    downloadNum -= 1;
    throw Error('Download Failed!');
  } else {
    throw new Error(`Unable to find the file <${filename}>.`);
  }
}

export function requestALTB(filename: string) {
  return requestFile(filename).then(res => {
    const table = parseAL(res);
    return table.Contents;
  });
}

export function PromiseAllPart(list: any[], key: string) {
  let promises: any[];
  try {
    promises = list.map(item => item[key]);
  } catch (err) {
    logger.info(err.message);
    promises = [];
  }
  return Promise.all(promises).then(reses => {
    reses.forEach((res, index) => {
      list[index][key] = res;
    });
    return list;
  });
}

export function numberPadding(num: number, length: number) {
  return (Array(length).join('0') + num).slice(-length);
}

export function ALTX2PNG(altx: ALTX) {
  return sharp(altx.Image as Buffer, {
    raw: {
      height: altx.Height,
      width: altx.Width,
      channels: 4,
    },
  }).png();
}

export async function streamToBuffer(stream: Stream) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    stream.on('data', (thunk: Buffer) => {
      buffer = Buffer.concat([buffer, thunk]);
    });
    stream.on('end', () => {
      return resolve(buffer);
    });
    stream.on('error', err => reject(err));
  }) as Promise<Buffer>;
}
