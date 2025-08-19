import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, JobsOptions } from 'bullmq';
import { IMAGE_QUEUE, JOB_GENERATE_VARIANTS } from './image-queue.constants';
import { GenerateVariantsJob } from './dto/generate-variants.job';

@Injectable()
export class ImageQueueService {
  constructor(@InjectQueue(IMAGE_QUEUE) private readonly queue: Queue) {}

  async enqueueGenerateVariants(payload: GenerateVariantsJob) {
    const opts: JobsOptions = {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { age: 3600, count: 1000 },
      removeOnFail: { age: 24 * 3600 },
    };
    return this.queue.add(JOB_GENERATE_VARIANTS, payload, opts);
  }
}
