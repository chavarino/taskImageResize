import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';
import { InputReaderPort } from 'src/domain/ports/input-reader.port';
import { InvalidSourceError, SourceNotFoundError, UpstreamUnavailableError } from 'src/domain/errors/input-errors';

@Injectable()
export class HttpInputReaderStrategy implements InputReaderPort {
  async getReadStream(src: string): Promise<Readable> {
    if (!/^https?:\/\//i.test(src)) throw new InvalidSourceError('Expected http/https URL');

    try {
      const res = await axios.get(src, { responseType: 'stream', validateStatus: () => true });
      if (res.status === 404) throw new SourceNotFoundError('Source URL not found');
      if (res.status < 200 || res.status >= 300) throw new UpstreamUnavailableError(`Upstream returned ${res.status}`);
      return res.data as Readable;
    } catch (e) {
      if (e instanceof InvalidSourceError || e instanceof SourceNotFoundError || e instanceof UpstreamUnavailableError) throw e;
      throw new UpstreamUnavailableError('Failed to fetch source URL');
    }
  }
}
