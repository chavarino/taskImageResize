import { Injectable } from '@nestjs/common';
import { InputSourceType } from 'src/domain/enums/input-source-type.enum';
import { UnsupportedSourceError } from 'src/domain/errors/input-errors';

@Injectable()
export class InputTypeService {
  detect(src: string): InputSourceType {
    if (typeof src !== 'string' || !src.trim()) throw new UnsupportedSourceError('Empty source');
    if (/^https?:\/\//i.test(src)) return InputSourceType.HTTP;
    return InputSourceType.FS;
  }
}
