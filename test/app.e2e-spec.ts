/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// test/tasks.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { TaskResponseDto } from 'src/shared/dtos/task-response.dto/task-response.dto';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    // Reproduces your main.ts validation behavior
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('accepts a valid https URL', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({ originalPath: 'https://example.com/image.jpg' })
        .expect(201);

      expect(res.body).toEqual(
        expect.objectContaining({
          taskId: expect.any(String),
          status: 'pending', // si tu use-case marca otro, ajusta aquí
          price: expect.any(Number),
          originalPath: 'https://example.com/image.jpg',
        }),
      );
    });

    it('accepts a valid relative path', async () => {
      const originalUrl = '/images/pic.jpg';
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({ originalPath: originalUrl })
        .expect(201);

      expect(res.body).toEqual(
        expect.objectContaining({
          taskId: expect.any(String),
          status: 'pending',
          price: expect.any(Number),
          originalPath: originalUrl,
        }),
      );
    });

    it('rejects an invalid path', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ originalPath: 'ftp://not-allowed' })
        .expect(400);
    });

    it('rejects when originalPath is missing', async () => {
      await request(app.getHttpServer()).post('/tasks').send({}).expect(400);
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns the created task', async () => {
      // First create
      const create = await request(app.getHttpServer())
        .post('/tasks')
        .send({ originalPath: '/foo/bar.jpg' })
        .expect(201);

      const { taskId } = create.body as TaskResponseDto;

      // Then fetch
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200);

      const body = response.body as TaskResponseDto;

      expect(body).toEqual(
        expect.objectContaining(create.body as TaskResponseDto),
      );

      // En pending/failed NO debe haber images; en completed SÍ.
      expect(body.images).toBeInstanceOf(Array);
    });

    it('returns 404 for a non-existing task', async () => {
      await request(app.getHttpServer())
        .get('/tasks/non-existing-id')
        .expect(404);
    });
  });
});
