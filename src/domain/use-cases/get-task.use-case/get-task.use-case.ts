// src/domain/use-cases/get-task.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseTaskRepository } from 'src/infrastructure/persistence/base-task.repository.service';
import { TaskResponseDto } from 'src/shared/dtos/task-response.dto/task-response.dto';
// Rutas relativas limpias: evita duplicar carpetas en el path

@Injectable()
export class GetTaskUseCase {
  constructor(private readonly repo: BaseTaskRepository) {}

  async execute(id: string): Promise<TaskResponseDto> {
    const task = await this.repo.findById(id);
    if (!task) throw new NotFoundException(`Tarea ${id} no encontrada`);
    return {
      taskId: task.id,
      status: task.status,
      price: task.price,
      images: task.images,
      originalPath: task.originalPath,
    } as TaskResponseDto;
  }
}
