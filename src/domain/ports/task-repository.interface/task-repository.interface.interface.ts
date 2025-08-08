import { Task } from 'src/domain/entities/task.entity/task.entity';

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
}
