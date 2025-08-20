// src/infrastructure/queues/bullmq/image-queue.consumer.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IMAGE_QUEUE } from './image-queue.constants';
import { ImageVariantsProcessor } from './image-variants.processor';
import { GenerateVariantsUseCase } from 'src/domain/use-cases/generate-variants.use-case';
import { FsOutputWriterService } from 'src/infrastructure/filesystem/fs-output-writer.service';
import { ImageResizerService } from 'src/infrastructure/images/image-resizer.service';
import { InputReaderFactory } from 'src/infrastructure/input/input-reader.factory';
import { FsInputReaderStrategy } from 'src/infrastructure/input/strategies/fs-input-reader.strategy';
import { HttpInputReaderStrategy } from 'src/infrastructure/input/strategies/http-input-reader.strategy';
import { FileNamingService } from 'src/shared/utils/file-naming.service';
import { HashingService } from 'src/shared/utils/hashing.service';
import { InputTypeService } from 'src/shared/utils/input-type.service';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';

@Module({
  imports: [
    PersistenceModule,
    BullModule.registerQueue({
      name: IMAGE_QUEUE,
    }),
  ],
  providers: [
    // Utils/infra para generate variants
    ImageResizerService,
    FileNamingService,
    HashingService,

    // Input resolution (FS/HTTP a demanda)
    InputTypeService,
    FsInputReaderStrategy,
    HttpInputReaderStrategy,
    InputReaderFactory,

    // Output writer (FS bajo ./output)
    { provide: FsOutputWriterService, useClass: FsOutputWriterService },
    ImageVariantsProcessor,
    GenerateVariantsUseCase,
  ],
})
export class ImageQueueConsumerModule {}
