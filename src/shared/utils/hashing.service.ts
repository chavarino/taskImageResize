import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { Transform } from 'stream';
import { finished } from 'stream/promises';

@Injectable()
export class HashingService {
  createMd5Tap(): { tap: Transform; done: Promise<string> } {
    const hash = createHash('md5');
    const tap = new Transform({
      transform(chunk, _enc, cb) {
        hash.update(chunk);
        cb(null, chunk);
      },
    });
    const done = (async () => {
      await finished(tap);
      return hash.digest('hex');
    })();
    return { tap, done };
  }
}
