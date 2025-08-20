import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TaskStatus } from 'src/shared/enums/taks-status.enum';

export type TaskDocument = HydratedDocument<TaskModel>;

@Schema({ collection: 'tasks', timestamps: true })
export class TaskModel {
  @Prop({ type: String })
  _id?: string;

  @Prop({ required: true })
  originalPath!: string;

  @Prop({ type: Number, required: true })
  price!: number;

  @Prop({ type: String, enum: TaskStatus, required: true, default: TaskStatus.PENDING })
  status!: TaskStatus;

  @Prop({
    type: [{
      resolution: { type: String },
      path: { type: String },
    }],
    required: false,
    default: undefined,
  })
  variants?: { resolution: string; path: string }[];
}

export const TaskSchema = SchemaFactory.createForClass(TaskModel);
