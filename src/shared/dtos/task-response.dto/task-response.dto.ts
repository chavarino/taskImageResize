import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from 'src/shared/enums/taks-status.enum';

export class Image {
  @ApiProperty({
    description: 'Width in pixels (keeps aspect ratio)',
    example: '1024',
  })
  resolution!: string;

  @ApiProperty({
    description: 'Generated image path',
    example: '/output/image1/1024/abc123.jpg',
  })
  path!: string;
}

export class TaskResponseDto {
  @ApiProperty({
    description: 'Task ID',
    example: '65d4a54b89c5e342b2c2c5f6',
  })
  taskId!: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.COMPLETED,
  })
  status!: TaskStatus;

  @ApiProperty({
    description: 'Assigned price',
    example: 25.5,
    minimum: 0,
  })
  price!: number;

  @ApiProperty({
    description:
      'Absolute URL (http/https) or a relative path starting with "/"',
    examples: ['https://url.com/image.jpg', '/images/pic.jpg'],
  })
  originalPath!: string;

  @ApiPropertyOptional({
    description: 'Generated variants (present only when status = completed)',
    type: () => [Image],
  })
  images?: Image[];
}
