import { TaskStatus } from 'src/shared/enums/taks-status.enum';

export class Task {
  public id: string = '';
  constructor(
    public readonly originalPath: string,
    public status: TaskStatus,
    public readonly price: number,
    public readonly images: {
      resolution: string;
      path: string;
    }[],
  ) {}
}
