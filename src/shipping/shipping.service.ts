import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Shipping } from './models/shipping';
import { isEmpty } from 'lodash';
import { NewShippingInput } from './dto/ new-shipping.input';

@Injectable()
export class ShippingService {
  constructor(
    @Inject('SHIPPINGS_REPOSITORY')
    private readonly SHIPPINGS_REPOSITORY: typeof Shipping,
  ) {}

  findAll(): Promise<Shipping[]> {
    return new Promise(async (rs, rj) => {
      const shippings = await this.SHIPPINGS_REPOSITORY.findAll().catch(err =>
        rj(err),
      );
      if (!shippings || isEmpty(shippings))
        return rj(
          new NotFoundException(
            'No Shippings Exists at the moment, please try again later',
          ),
        );
      return rs(shippings);
    });
  }

  insertShipping(shippingInput: NewShippingInput): Promise<Shipping> {
    return new Promise(async (rs, rj) => {
      shippingInput = JSON.parse(JSON.stringify(shippingInput));
      const shipping = await this.SHIPPINGS_REPOSITORY.create(
        shippingInput,
      ).catch(err => rj(err));
      if (!shipping || isEmpty(shipping))
        return rj(new BadRequestException('Could Not Create Shipping'));
      return rs(shipping);
    });
  }
}
