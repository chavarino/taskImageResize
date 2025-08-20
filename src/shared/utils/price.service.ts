import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceService {
    calcRandom() {
        return parseFloat((Math.random() * 100).toFixed(2));
    }
}
