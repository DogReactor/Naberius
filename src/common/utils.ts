import * as _ from 'lodash';
import { ALTX } from 'aigis-fuel';
import * as sharp from 'sharp';
import { Stream } from 'stream';

/**
 * sleep for a time
 * @param ms time(ms)
 */
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function numberPadding(num: number, length: number) {
  return (Array(length).join('0') + num).slice(-length);
}

export function cardIDPadding(id: number) {
  if (id < 1000) {
    return id.toString().padStart(3, '0');
  } else {
    return id.toString();
  }
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
