import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Readable } from 'stream';
import { InputTypeService } from 'src/shared/utils/input-type.service';
import { InputSourceType } from 'src/domain/enums/input-source-type.enum';
import { UnsupportedSourceError } from 'src/domain/errors/input-errors';
import { InputReaderPort } from 'src/domain/ports/input-reader.port';
import { FsInputReaderStrategy } from './strategies/fs-input-reader.strategy';
import { HttpInputReaderStrategy } from './strategies/http-input-reader.strategy';

type StrategyTokenMap = {
  [InputSourceType.FS]: typeof FsInputReaderStrategy;
  [InputSourceType.HTTP]: typeof HttpInputReaderStrategy;
};

@Injectable()
export class InputReaderFactory {
  private readonly map: StrategyTokenMap = {
    [InputSourceType.FS]: FsInputReaderStrategy,
    [InputSourceType.HTTP]: HttpInputReaderStrategy,
  };

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly inputType: InputTypeService,
  ) {}

  async open(src: string): Promise<Readable> {
    const type = this.inputType.detect(src);
    const token = this.map[type];
    if (!token) throw new UnsupportedSourceError(`No strategy for type: ${type}`);
    const strategy = this.moduleRef.get<InputReaderPort>(token, { strict: false });
    return strategy.getReadStream(src);
  }
}
