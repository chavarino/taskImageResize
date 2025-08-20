import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseTaskRepository } from './base-task.repository.service';
import { MongoTaskRepository } from './mongo/mongo-task.repository';
import { TaskModel, TaskSchema } from './mongo/task.schema';

function mongoUri(cfg: ConfigService): string {
  const direct = cfg.get<string>('MONGO_URI');
  if (direct) return direct;
  const host = cfg.get<string>('MONGO_HOST', 'localhost');
  const port = cfg.get<string>('MONGO_PORT', '27017');
  const user = cfg.get<string>('MONGO_USER', 'root');
  const pass = cfg.get<string>('MONGO_PASS', 'root');
  const db = cfg.get<string>('MONGO_DB', 'app');
  return `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;
}

const taskRepositoryImpl = {
  provide: BaseTaskRepository,
  useClass: MongoTaskRepository,
};
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: mongoUri(cfg),
      }),
    }),
    MongooseModule.forFeature([{ name: TaskModel.name, schema: TaskSchema }]),
  ],
  providers: [taskRepositoryImpl],
  exports: [taskRepositoryImpl],
})
export class PersistenceModule {}
