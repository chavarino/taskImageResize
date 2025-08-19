import { Injectable } from '@nestjs/common';
import { pipeline } from 'stream/promises';
import { randomBytes } from 'crypto';
import { Readable } from 'stream';

import { InputReaderFactory } from 'src/infrastructure/input/input-reader.factory';
import { ImageResizerService } from 'src/infrastructure/images/image-resizer.service';

import { FileNamingService } from 'src/shared/utils/file-naming.service';
import { HashingService } from 'src/shared/utils/hashing.service';
import { FsOutputWriterService } from 'src/infrastructure/filesystem/fs-output-writer.service';
import { BaseTaskRepository } from 'src/infrastructure/persistence/base-task.repository.service';
import { TaskStatus } from 'src/shared/enums/taks-status.enum';
import { Image } from 'src/domain/entities/task.entity/task.entity';
export type OutputFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'tiff';

export interface GenerateVariantsOptions {
  userId?: string;
  overrideSizes?: number[];
  format?: OutputFormat;
  quality?: number;
}

export interface GeneratedVariant {
  resolution: number;
  md5: string;
  relativePath: string;
  publicPath: string;
}

@Injectable()
export class GenerateVariantsUseCase {
  constructor(
    private readonly inputFactory: InputReaderFactory,
    private readonly resizer: ImageResizerService,
    private readonly writer: FsOutputWriterService,
    private readonly naming: FileNamingService,
    private readonly hashing: HashingService,
    private readonly repo: BaseTaskRepository,
  ) {}

  async execute(
    originalPath: string,
    taskId: string,
    sizes: number[] = [1024, 800],
    opts: GenerateVariantsOptions = {},
  ): Promise<void> {
    const images: Image[] = [];

    for (const width of sizes) {
      const input: Readable = await this.inputFactory.open(originalPath);
      const { tap, done } = this.hashing.createMd5Tap();

      const tmpExt = (
        opts.format ??
        this.naming.extractNameAndExt(originalPath).ext ??
        'jpg'
      ).replace(/^jpeg$/i, 'jpg');
      const tmpRel = `tmp/${randomBytes(8).toString('hex')}.${tmpExt}`;
      const tmpWritable = await this.writer.getWriteStream(tmpRel);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const transformer = this.resizer.createTransformer(width, {
        format: opts.format,
        quality: opts.quality,
      });
      await pipeline(input, transformer, tap, tmpWritable);
      const md5 = await done;

      const { relative, public: publicPath } = this.naming.buildOutputPaths({
        src: originalPath,
        resolution: width,
        md5,
        outputFormat: opts.format,
      });

      await this.writer.move(tmpRel, relative);

      images.push({ path: publicPath, resolution: width.toString() });
    }

    console.info(images);
    await this.repo.update(taskId, { images, status: TaskStatus.COMPLETED });
  }
}
