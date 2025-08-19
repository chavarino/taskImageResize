import { Readable } from 'stream';

export interface InputReaderPort {
  getReadStream(src: string): Promise<Readable>;
}
