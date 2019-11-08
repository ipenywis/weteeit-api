import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { NewShippingInput } from './dto/ new-shipping.input';
import { Shipping } from './models/shipping';

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

  findByWilaya(wilaya: string): Promise<Shipping> {
    return new Promise(async (rs, rj) => {
      const shipping = await this.SHIPPINGS_REPOSITORY.findOne({
        where: { wilaya },
      }).catch(err => rj(err));
      if (!shipping || isEmpty(shipping))
        return rj(
          new NotFoundException('No Shipping details found for wilaya'),
        );
      return rs(shipping);
    });
  }

  shippingExists(wilaya: string): Promise<Boolean> {
    return new Promise(async (rs, rj) => {
      const shipping = await this.SHIPPINGS_REPOSITORY.findOne({
        where: { wilaya },
      }).catch(err => rj(err));
      if (!shipping || isEmpty(shipping)) return rs(false);
      else return rs(true);
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

  updateShipping(
    id: number,
    shippingInput: NewShippingInput,
  ): Promise<Boolean> {
    return new Promise(async (rs, rj) => {
      const updatedShipping = await this.SHIPPINGS_REPOSITORY.update(
        shippingInput,
        { where: { id } },
      ).catch(err => rj(err));

      if (!updatedShipping || isEmpty(updatedShipping))
        return rj(new NotFoundException('No Shipping Found with id'));
      else return rs(true);
    });
  }

  deleteShipping(id: number): Promise<Boolean> {
    return new Promise(async (rs, rj) => {
      const deletedShipping = await this.SHIPPINGS_REPOSITORY.destroy({
        where: { id },
      }).catch(err => rj(err));
      if (!deletedShipping) return rs(false);
      else return rs(true);
    });
  }
}
