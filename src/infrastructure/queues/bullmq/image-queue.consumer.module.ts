// src/infrastructure/queues/bullmq/image-queue.consumer.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IMAGE_QUEUE } from './image-queue.constants';
import { ImageVariantsProcessor } from './image-variants.processor';
import { GenerateVariantsUseCase } from 'src/domain/use-cases/generate-variants.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: IMAGE_QUEUE,
    }),
  ],
  providers: [ImageVariantsProcessor, GenerateVariantsUseCase],
})
export class ImageQueueConsumerModule {}
