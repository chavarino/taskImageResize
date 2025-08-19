/* eslint-disable @typescript-eslint/no-unused-vars */
// src/infrastructure/persistence/mongo-task.repository.ts
import { Injectable } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity/task.entity';

@Injectable()
export abstract class BaseTaskRepository {
  abstract save(task: Task): Promise<Task>;
  abstract findById(id: string): Promise<Task | null>;

  abstract update(id: string, task: Partial<Task>): Promise<Task>;
}
