/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import sharp, { FormatEnum } from 'sharp';

type OutputFormat = keyof FormatEnum;

export interface ResizeStreamOptions {
  format?: OutputFormat;
  quality?: number;
}

@Injectable()
export class ImageResizerService {
  createTransformer(
    width: number,
    opts: { format?: keyof FormatEnum; quality?: number } = {},
  ) {
    if (!Number.isFinite(width) || width <= 0) {
      throw new Error('width must be a positive number');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const transformer = sharp().resize({
      width,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (opts.format) {
      const fmt = opts.format === 'jpg' ? 'jpeg' : opts.format;
      transformer.toFormat(
        fmt,
        typeof opts.quality === 'number'
          ? { quality: opts.quality }
          : undefined,
      );
    }
    return transformer;
  }
}
