import * as _ from 'lodash';
import { ALTX } from 'aigis-fuel';
import * as sharp from 'sharp';
import { Stream } from 'stream';

/**
 * sleep for a time
 * @param ms time(ms)
 */
export async function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

export function numberPadding(num: number, length: number) {
  return num.toString().padStart(length, '0');
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

// did this because sharp.extract() modifies source sharp instance (>=0.33)
export function ALTXExtractPNG(
  altx: ALTX, left: number, top: number, width: number, height: number) {
  const buf = altx.Image as Buffer;
  const w = altx.Width;
  const h = altx.Height;
  if ((left < 0) || (top < 0) || (left + width > w) || (top + height > h)) {
    throw new Error("ALTXExtractPNG: Area Out of Range");
  }
  const dest = Buffer.alloc(width * height * 4);
  const lineSize = (w << 2);
  const destLineSize = (width << 2);
  let start = (top * w + left) << 2;
  let destStart = 0;
  for (let i = 0; i < height; ++i) {
    buf.copy(dest, destStart, start, start + destLineSize);
    start = start + lineSize;
    destStart = destStart + destLineSize;
  }
  return sharp(dest, {
    raw: {
      height: height,
      width: width,
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

/**
 * Return C-style String according to str as a char buffer.
 * 'name' attribute in AL may contain multiple \x00 at tail.
 * @return a C-Style substring which ends before first \x00
*/
export function toCString(str: string) {
  const len = str.length;
  let end = 0;
  while (end < len && str.charCodeAt(end) !== 0) {
    ++end;
  }
  return str.substring(0, end);
}
