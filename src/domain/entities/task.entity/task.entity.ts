import { TaskStatus } from 'src/shared/enums/taks-status.enum';

export type Image = {
  resolution: string;
  path: string;
};

export class Task {
  public _id: string = '';
  constructor(
    public readonly originalPath: string,
    public status: TaskStatus,
    public readonly price: number,
    public readonly images: Image[],
  ) {}
}
