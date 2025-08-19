/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import sharp, { FormatEnum } from 'sharp';
import { Readable, Writable } from 'stream';
import { pipeline } from 'stream/promises';

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
  async pipeResized(
    width: number,
    input: Readable,
    output: Writable,
    opts: ResizeStreamOptions = {},
  ): Promise<void> {
    if (!Number.isFinite(width) || width <= 0) {
      throw new Error('width must be a positive number');
    }

    const transformer = sharp().resize({
      width,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (opts.format) {
      transformer.toFormat(
        opts.format,
        typeof opts.quality === 'number'
          ? { quality: opts.quality }
          : undefined,
      );
    }
    console.log(
      `Resizing to ${width}px, format: ${opts.format}, quality: ${opts.quality}`,
    );
    input.on('error', (err) => {
      transformer.destroy(err);
      console.error(`Input stream error: ${err.message}`);
    });
    await pipeline(input, transformer, output);
    console.log(`finished resizing to ${width}px`);
  }
}
