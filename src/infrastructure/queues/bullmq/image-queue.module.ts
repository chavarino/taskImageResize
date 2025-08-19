import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IMAGE_QUEUE } from './image-queue.constants';
import { ImageQueueService } from './image-queue.service';
import { ImageVariantsProcessor } from './image-variants.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        connection: {
          host: cfg.get<string>('REDIS_HOST', 'localhost'),
          port: cfg.get<number>('REDIS_PORT', 6379),
          password: cfg.get<string>('REDIS_PASSWORD'),
          db: cfg.get<number>('REDIS_DB', 0),
        },
      }),
    }),
    BullModule.registerQueue({ name: IMAGE_QUEUE }),
  ],
  providers: [ImageQueueService, ImageVariantsProcessor],
  exports: [ImageQueueService],
})
export class ImageQueueModule {}
