import { Injectable } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity/task.entity';
import { BaseTaskRepository } from 'src/infrastructure/persistence/base-task.repository.service';
import { CreateTaskDto } from 'src/shared/dtos/create-task.dto/create-task.dto';
import {
  TaskResponseDto,
  Image,
} from 'src/shared/dtos/task-response.dto/task-response.dto';
import { TaskStatus } from 'src/shared/enums/taks-status.enum';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly repo: BaseTaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const price = parseFloat((Math.random() * 100).toFixed(2)); // service
    const task = new Task(dto.originalPath, TaskStatus.PENDING, price, []);
    const taskCreated = await this.repo.save(task);
    return {
      taskId: taskCreated.id,
      status: taskCreated.status,
      price: taskCreated.price,
      originalPath: taskCreated.originalPath,
      images: taskCreated.images as Image[],
    };
  }
}
