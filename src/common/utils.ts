import * as _ from 'lodash';
import { ALTX } from 'aigis-fuel';
import * as sharp from 'sharp';
import { Stream } from 'stream';
import { logger } from './logger';

/**
 * sleep for a time
 * @param ms time(ms)
 */
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
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
