import { Injectable } from '@nestjs/common';
import { promises as fsp, createReadStream } from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { InputReaderPort } from 'src/domain/ports/input-reader.port';
import {
  InvalidSourceError,
  SourceNotFoundError,
} from 'src/domain/errors/input-errors';

@Injectable()
export class FsInputReaderStrategy implements InputReaderPort {
  private readonly baseDir = path.resolve(process.cwd(), 'input');

  async getReadStream(src: string): Promise<Readable> {
    console.log(`Opening FS input stream for: ${src}`);
    if (typeof src !== 'string')
      throw new InvalidSourceError('Expected string path');
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(src))
      throw new InvalidSourceError('Expected relative path');
    console.log(`opening}`);

    const clean = src.replace(/^[\\/]+/, '');
    const fullPath = path.resolve(this.baseDir, clean);
    const rel = path.relative(this.baseDir, fullPath);
    if (rel.startsWith('..') || path.isAbsolute(rel))
      throw new InvalidSourceError('Path escapes input directory');

    try {
      const st = await fsp.stat(fullPath);
      if (!st.isFile()) throw new SourceNotFoundError('Source is not a file');
    } catch {
      throw new SourceNotFoundError('Source file not found');
    }

    console.log(`Resolved full path: ${fullPath}`);
    return createReadStream(fullPath);
  }
}
