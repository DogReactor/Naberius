import * as request from 'request-promise-native';
import * as _ from 'lodash';
import { parseAL, ALTX } from 'aigis-fuel';
import * as sharp from 'sharp';
import { Stream } from 'stream';
import { logger } from './logger';
// import { BASE_URL } from '../consts';

/**
 * sleep for a time
 * @param ms time(ms)
 */
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

let downloadNum = 0;

export async function requestFile(fileURL: string, fileName: string) {
  while (true) {
    if (downloadNum < 10) {
      break;
    }
    await sleep(1000);
  }
  downloadNum += 1;
  logger.info(`+${downloadNum} Downloading ${fileName}`);
  for (let retry = 1; retry <= 3; retry++) {
    try {
      const res = await request.get({
        url: fileURL,
        encoding: null,
        timeout: 50 * 1000,
        proxy: process.env.proxy,
        gzip: true,
        family: 4,
      });
      logger.info(`-${downloadNum} Downloaded ${fileName}!`);
      downloadNum -= 1;
      return res;
    } catch (err) {
      logger.error(err.stack);
      logger.info(
        `=${downloadNum} Failed downloading ${fileName}, retry ${retry}...`,
      );
    }
  }
  logger.error(`-${downloadNum} Failed downloading ${fileName}!`);
  downloadNum -= 1;
  throw Error('Download Failed!');
}

export function requestALTB(fileUrl: string, fileName: string) {
  return requestFile(fileUrl, fileName).then(res => {
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
