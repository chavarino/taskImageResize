import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from './domain/use-cases/create-task.use-case/create-task.use-case';
import { GetTaskUseCase } from './domain/use-cases/get-task.use-case/get-task.use-case';
import { TasksController } from './infrastructure/http/controllers/tasks/tasks.controller';
import { MockTaskRepository } from './infrastructure/persistence/mock-task.repository/mock-task.repository.service';
import { BaseTaskRepository } from './infrastructure/persistence/base-task.repository.service';
import { GenerateVariantsUseCase } from './domain/use-cases/generate-variants.use-case';
import { FsOutputWriterService } from './infrastructure/filesystem/fs-output-writer.service';
import { ImageResizerService } from './infrastructure/images/image-resizer.service';
import { InputReaderFactory } from './infrastructure/input/input-reader.factory';
import { FsInputReaderStrategy } from './infrastructure/input/strategies/fs-input-reader.strategy';
import { HttpInputReaderStrategy } from './infrastructure/input/strategies/http-input-reader.strategy';
import { FileNamingService } from './shared/utils/file-naming.service';
import { HashingService } from './shared/utils/hashing.service';
import { InputTypeService } from './shared/utils/input-type.service';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
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
