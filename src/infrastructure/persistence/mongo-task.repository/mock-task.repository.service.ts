import { Injectable } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity/task.entity';
import { BaseTaskRepository } from '../base-task.repository.service';

const STORE = new Map<string, Task>();

@Injectable()
export class MockTaskRepository extends BaseTaskRepository {
  save(task: Task) {
    task.id = Math.random().toString(36).slice(2);
    STORE.set(task.id, task);
    return Promise.resolve(task);
  }
  findById(id: string): Promise<Task | null> {
    return Promise.resolve(STORE.get(id) ?? null);
  }
}
