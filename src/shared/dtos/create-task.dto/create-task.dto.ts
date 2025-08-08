import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description:
      'Absolute URL (http/https) or a relative path starting with "/"',
    examples: ['https://example.com/image.jpg', '/images/pic.jpg'],
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(https?:\/\/\S+|\/\S+)$/, {
    message:
      'originalPath must be a URL (http/https) or a relative path starting with "/"',
  })
  originalPath: string;
}
