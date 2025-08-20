// src/infrastructure/queues/bullmq/image-queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IMAGE_QUEUE } from './image-queue.constants';
import { ImageQueueService } from './image-queue.service';

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
    // Registramos la cola (necesaria tanto para producer como para worker)
    BullModule.registerQueue({
      name: IMAGE_QUEUE,
      // workerOptions aquí NO hacen nada si no registras el worker; se aplican cuando haya processor.
    }),
  ],
  providers: [ImageQueueService],
  exports: [ImageQueueService],
})
export class ImageQueueModule {}
