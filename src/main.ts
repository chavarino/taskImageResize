import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilita validación global:
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina props no definidas en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan props extrañas
      transform: true, // convierte payload a instancias de DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Image Processing API')
    .setDescription(
      'Create processing tasks, assign price, and retrieve results',
    )
    .setVersion('1.0.0')
    .addTag('tasks')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
