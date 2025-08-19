import { Writable } from 'stream';

export interface OutputWriterPort {
  getWriteStream(savePath: string): Promise<Writable>;
  move(fromRelativePath: string, toRelativePath: string): Promise<void>;
}
