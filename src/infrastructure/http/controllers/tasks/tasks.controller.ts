// src/infrastructure/http/controllers/tasks.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

import { CreateTaskUseCase } from 'src/domain/use-cases/create-task.use-case/create-task.use-case';
import { GetTaskUseCase } from 'src/domain/use-cases/get-task.use-case/get-task.use-case';
import { CreateTaskDto } from 'src/shared/dtos/create-task.dto/create-task.dto';
import { TaskResponseDto } from 'src/shared/dtos/task-response.dto/task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image processing task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Task created',
    type: TaskResponseDto,
  })
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.createTaskUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task status and results' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiOkResponse({
    description: 'Task details',
    type: TaskResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.getTaskUseCase.execute(id);
  }
}
