import { Injectable } from '@nestjs/common';
import { promises as fsp } from 'fs';
import { createWriteStream, WriteStream } from 'fs';
import * as path from 'path';
import { OutputWriterPort } from 'src/domain/ports/output-writer.port';

@Injectable()
export class FsOutputWriterService implements OutputWriterPort {
  private readonly baseDir = path.resolve(process.cwd(), 'output');

  async getWriteStream(savePath: string): Promise<WriteStream> {
    const full = this.resolveInsideBase(savePath);
    await fsp.mkdir(path.dirname(full), { recursive: true });
    return createWriteStream(full, { flags: 'w' });
  }

  async move(fromRelativePath: string, toRelativePath: string): Promise<void> {
    if (!fromRelativePath || !toRelativePath) {
      throw new Error('Both fromRelativePath and toRelativePath are required');
    }
    if (fromRelativePath === toRelativePath) return;

    const from = this.resolveInsideBase(fromRelativePath);
    const to = this.resolveInsideBase(toRelativePath);

    try {
      const st = await fsp.stat(from);
      if (!st.isFile()) throw new Error('Source is not a file');
    } catch {
      throw new Error(`Source file not found: ${fromRelativePath}`);
    }

    await fsp.mkdir(path.dirname(to), { recursive: true });
    await fsp.rename(from, to);
  }

  private resolveInsideBase(relPath: string): string {
    if (typeof relPath !== 'string' || !relPath.trim()) {
      throw new Error('Invalid relative path');
    }
    const clean = relPath.replace(/^[\\/]+/, '');
    const full = path.resolve(this.baseDir, clean);
    const rel = path.relative(this.baseDir, full);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error('Path escapes output directory');
    }
    return full;
  }
}
