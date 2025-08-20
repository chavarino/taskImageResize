import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTaskUseCase } from './domain/use-cases/create-task.use-case/create-task.use-case';
import { GenerateVariantsUseCase } from './domain/use-cases/generate-variants.use-case';
import { GetTaskUseCase } from './domain/use-cases/get-task.use-case/get-task.use-case';
import { FsOutputWriterService } from './infrastructure/filesystem/fs-output-writer.service';
import { TasksController } from './infrastructure/http/controllers/tasks/tasks.controller';
import { ImageResizerService } from './infrastructure/images/image-resizer.service';
import { InputReaderFactory } from './infrastructure/input/input-reader.factory';
import { FsInputReaderStrategy } from './infrastructure/input/strategies/fs-input-reader.strategy';
import { HttpInputReaderStrategy } from './infrastructure/input/strategies/http-input-reader.strategy';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { ImageQueueModule } from './infrastructure/queues/bullmq/image-queue.module';
import { FileNamingService } from './shared/utils/file-naming.service';
import { HashingService } from './shared/utils/hashing.service';
import { InputTypeService } from './shared/utils/input-type.service';
import { ImageQueueConsumerModule } from './infrastructure/queues/bullmq/image-queue.consumer.module';
const CONSUMER_ENABLED =
  String(process.env.CONSUMER ?? 'false').toLowerCase() === 'true';

const configImports = () => {
  const staticImports = [PersistenceModule, ImageQueueModule];
  // is consumer enabled? then up consumer
  if (CONSUMER_ENABLED) staticImports.push(ImageQueueConsumerModule);

  return staticImports;
};

@Module({
  imports: configImports(),
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    GetTaskUseCase,
    GenerateVariantsUseCase,

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
  ],
})
export class AppModule {}
