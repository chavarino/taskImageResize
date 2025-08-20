import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from './domain/use-cases/create-task.use-case/create-task.use-case';
import { GetTaskUseCase } from './domain/use-cases/get-task.use-case/get-task.use-case';
import { TasksController } from './infrastructure/http/controllers/tasks/tasks.controller';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { ImageQueueConsumerModule } from './infrastructure/queues/bullmq/image-queue.consumer.module';
import { ImageQueueModule } from './infrastructure/queues/bullmq/image-queue.module';
const CONSUMER_ENABLED =
  String(process.env.CONSUMER ?? 'false').toLowerCase() === 'true';

const configImports = () => {
  const staticImports = [PersistenceModule, ImageQueueModule];
  // is consumer enabled? then up consumer
  if (CONSUMER_ENABLED) {
    console.info("---->Adding queue consumer")
    staticImports.push(ImageQueueConsumerModule);
  }

  return staticImports;
};

@Module({
  imports: configImports(),
  controllers: [TasksController],
  providers: [CreateTaskUseCase, GetTaskUseCase],
})
export class AppModule {}
