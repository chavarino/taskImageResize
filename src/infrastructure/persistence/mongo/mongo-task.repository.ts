import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types  } from 'mongoose';
import { BaseTaskRepository } from '../base-task.repository.service';
import { Task } from 'src/domain/entities/task.entity/task.entity';
import { TaskModel, TaskDocument } from './task.schema';
type Persistable = Omit<TaskModel, '_id'>;
@Injectable()
export class MongoTaskRepository extends BaseTaskRepository {
  constructor(@InjectModel(TaskModel.name) private readonly taskModel: Model<TaskDocument>) {
    super();
  }

  private toPersistence(entity: Task): Persistable {
    return {
      originalPath: entity.originalPath,
      price: entity.price,
      status: entity.status,
      images: entity.images?.map(v => ({
        resolution: String(v.resolution),
        path: v.path,
      })),
    };
  }

  private toDomain(doc: TaskModel): Task {
    return {
      _id: String(doc._id),
      originalPath: doc.originalPath,
      price: doc.price,
      status: doc.status,
      images: Array.isArray(doc.images)
        ? doc.images.map((v: any) => ({
          resolution: String(v.resolution),
          path: v.path,
        }))
        : undefined,
    } as Task;
  }
  private toObjectId(id: string): Types.ObjectId | null {
    return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
  }
  async save(task: Task): Promise<Task> {
    const data = this.toPersistence(task);
    const created = await this.taskModel.create(data as any);
    const plain = typeof (created as any).toObject === 'function' ? (created as any).toObject() : created;
    return this.toDomain(plain);
  }

  async findById(id: string): Promise<Task | null> {
    const oid = this.toObjectId(id);
    if (!oid) return null;
    const found = await this.taskModel.findById(oid).lean();
    if (!found) return null;
    return this.toDomain(found);
  }

  async update(id: string, task: Task): Promise<Task> {
    const data = this.toPersistence(task);
    const updated = await this.taskModel
      .findByIdAndUpdate(id, { $set: data }, { new: true, lean: true })
      .exec();

    if (!updated) throw new Error('Task not found');
    return this.toDomain(updated);
  }
}
