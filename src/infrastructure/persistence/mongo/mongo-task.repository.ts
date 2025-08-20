import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseTaskRepository } from '../base-task.repository.service';
import { Task } from 'src/domain/entities/task.entity/task.entity';
import { TaskModel, TaskDocument } from './task.schema';

@Injectable()
export class MongoTaskRepository extends BaseTaskRepository {
  constructor(
    @InjectModel(TaskModel.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {
    super();
  }

  async save(task: Task): Promise<Task> {
    const created = await new this.taskModel(task).save();
    return created.toObject() as unknown as Task;
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.taskModel.findById(id).lean();
    return (found as unknown as Task) ?? null;
  }

  async update(id: string, task: Task): Promise<Task> {
    const updated = await this.taskModel
      .findByIdAndUpdate(id, { $set: task }, { new: true, lean: true })
      .exec();
    if (!updated) throw new Error('Task not found');
    return updated as unknown as Task;
  }
}
