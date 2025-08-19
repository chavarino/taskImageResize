import { Injectable } from '@nestjs/common';
import * as path from 'path';

type SharpFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif' | 'heif';

export interface BuildOutputPathArgs {
  src: string;
  resolution: number | string;
  md5: string;
  outputFormat?: SharpFormat;
}

export interface OutputPaths {
  ext: string;
  relative: string;
  public: string;
}

@Injectable()
export class FileNamingService {
  extractNameAndExt(src: string): { name: string; ext?: string } {
    if (!src || typeof src !== 'string') {
      return { name: 'file', ext: undefined };
    }
    const isHttp = /^https?:\/\//i.test(src);
    const rawPath = isHttp ? safeUrlPathname(src) : normalizeFsPath(src);
    const base = path.posix.basename(rawPath);
    const parsed = path.posix.parse(base);
    const name = sanitizeName(parsed.name || 'file');
    const ext = (parsed.ext || '').replace(/^\./, '') || undefined;
    return { name, ext };
  }

  buildOutputPaths(args: BuildOutputPathArgs): OutputPaths {
    const { src, resolution, md5, outputFormat } = args;
    const { name, ext: fromSrc } = this.extractNameAndExt(src);
    const ext = normalizeExt(outputFormat ?? fromSrc ?? 'jpg');
    const rel = path.posix.join(name, String(resolution), `${md5}.${ext}`);
    const pub = `/${path.posix.join('output', rel)}`;
    return { ext, relative: rel, public: pub };
  }
}

function safeUrlPathname(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    const pathname = u.pathname || '/file';
    const last = pathname.split('/').filter(Boolean).pop() ?? 'file';
    return `/${decodeURIComponent(last)}`;
  } catch {
    return '/file';
  }
}

function normalizeFsPath(p: string): string {
  const unix = p.replace(/\\/g, '/').replace(/^[./]+/, '');
  return `/${unix}`;
}

function sanitizeName(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
    .slice(0, 120) || 'file';
}

function normalizeExt(ext: string): string {
  const e = ext.toLowerCase().replace(/^\./, '');
  if (e === 'jpeg') return 'jpg';
  return e;
}
