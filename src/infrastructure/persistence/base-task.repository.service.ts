/* eslint-disable @typescript-eslint/no-unused-vars */
// src/infrastructure/persistence/mongo-task.repository.ts
import { Injectable } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity/task.entity';

@Injectable()
export class BaseTaskRepository {
  save(task: Task): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Task | null> {
    throw new Error('Method not implemented.');
  }
}
