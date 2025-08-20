// src/infrastructure/queues/bullmq/image-queue.consumer.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IMAGE_QUEUE } from './image-queue.constants';
import { ImageVariantsProcessor } from './image-variants.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: IMAGE_QUEUE,
    }),
  ],
  providers: [ImageVariantsProcessor],
})
export class ImageQueueConsumerModule {}
