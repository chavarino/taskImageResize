import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from './domain/use-cases/create-task.use-case/create-task.use-case';
import { GetTaskUseCase } from './domain/use-cases/get-task.use-case/get-task.use-case';
import { TasksController } from './infrastructure/http/controllers/tasks/tasks.controller';
import { MockTaskRepository } from './infrastructure/persistence/mongo-task.repository/mock-task.repository.service';
import { BaseTaskRepository } from './infrastructure/persistence/base-task.repository.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    {
      provide: BaseTaskRepository,
      useClass: MockTaskRepository,
    },
    CreateTaskUseCase,
    GetTaskUseCase,
  ],
})
export class AppModule {}
