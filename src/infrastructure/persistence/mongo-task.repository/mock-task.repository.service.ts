import { Injectable } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity/task.entity';
import { BaseTaskRepository } from '../base-task.repository.service';

const STORE = new Map<string, Task>();

@Injectable()
export class MockTaskRepository extends BaseTaskRepository {
  update(id: string, task: Task): Promise<Task> {
    const oldTask = STORE.get(id);
    const updatedTask: Task = { ...oldTask, ...task, _id: id };
    STORE.set(id, updatedTask);
    return Promise.resolve(updatedTask);
  }

  save(task: Task) {
    task._id = Math.random().toString(36).slice(2);
    STORE.set(task._id, task);
    return Promise.resolve(task);
  }
  findById(id: string): Promise<Task | null> {
    return Promise.resolve(STORE.get(id) ?? null);
  }
}
