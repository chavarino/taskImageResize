import { Processor } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { IMAGE_QUEUE, JOB_GENERATE_VARIANTS } from './image-queue.constants';
import { GenerateVariantsUseCase } from 'src/domain/use-cases/generate-variants.use-case';
import { GenerateVariantsJob } from './dto/generate-variants.job';

@Processor(IMAGE_QUEUE)
@Injectable()
export class ImageVariantsProcessor {
  private readonly logger = new Logger(ImageVariantsProcessor.name);

  constructor(private readonly generateVariants: GenerateVariantsUseCase) {}

  //@Process({ name: JOB_GENERATE_VARIANTS, concurrency: 2 })
  async handle(job: Job<GenerateVariantsJob>) {
    const { originalPath, taskId } = job.data;
    try {
      const variants = await this.generateVariants.execute(
        originalPath,
        taskId /*, {
       // overrideSizes,
        format,
        quality,
      }*/,
      );
      return { variants, taskId };
    } catch (err: any) {
      this.logger.error(`Failed to generate variants for : ${err}`);
      throw err;
    }
  }
}
