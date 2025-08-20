// src/infrastructure/queues/bullmq/image-variants.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { GenerateVariantsUseCase } from 'src/domain/use-cases/generate-variants.use-case';
import { GenerateVariantsJob } from './dto/generate-variants.job';
import { IMAGE_QUEUE, JOB_GENERATE_VARIANTS } from './image-queue.constants';

@Processor(IMAGE_QUEUE, { concurrency: 2 }) // también puedes mover la concurrencia al módulo (workerOptions)
@Injectable()
export class ImageVariantsProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageVariantsProcessor.name);

  constructor(private readonly generateVariants: GenerateVariantsUseCase) {
    super();
  }

  async process(job: Job<GenerateVariantsJob>) {
    if (job.name !== JOB_GENERATE_VARIANTS) {
      this.logger.warn(`Unknown job: ${job.name}`);
      return null;
    }
    const { originalPath, taskId, overrideSizes } = job.data;

    try {
      await job.updateProgress(10);
      await this.generateVariants.execute(originalPath, taskId, overrideSizes);

      await job.updateProgress(100);
    } catch (err: any) {
      this.logger.error(`Failed to generate variants: ${err}`);
      await job.moveToFailed(err, 'Failed to generate image variants');
    }
  }
}
