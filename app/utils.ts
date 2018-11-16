import { Stream } from 'stream';

export async function streamToBuffer(stream: Stream) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.alloc(0);
    stream.on('data', (thunk: Buffer) => Buffer.concat([buffer, thunk]));
    stream.on('end', () => resolve(buffer));
    stream.on('error', err => reject(err));
  });
}
