import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Product } from './models/product';
import { isEmpty } from 'lodash';
import { NewProductInput } from './dto/new-product.input';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private readonly PRODUCTS_REPOSITORY: typeof Product,
  ) {}

  findAll(): Promise<Product[]> {
    return new Promise(async (rs, rj) => {
      const products = await this.PRODUCTS_REPOSITORY.findAll().catch(err =>
        rj(err),
      );
      if (!products || isEmpty(products))
        return rj(
          new NotFoundException(
            'No Products exists at the moment, please try again later',
          ),
        );
      return rs(products);
    });
  }

  findOneById(id: string): Promise<Product> {
    return new Promise(async (rs, rj) => {
      const product = await this.PRODUCTS_REPOSITORY.findOne({
        where: { id },
      }).catch(err => rj(err));
      if (!product || isEmpty(product))
        return rj(new NotFoundException('No Product found with specified id'));
      return rs(product);
    });
  }

  findOneByName(name: string): Promise<Product> {
    return new Promise(async (rs, rj) => {
      console.log('Fetching Product by name');
      const product = await this.PRODUCTS_REPOSITORY.findOne({
        where: { name },
      }).catch(err => rj(new InternalServerErrorException()));
      if (!product || isEmpty(product))
        return rj(new NotFoundException('Product Not Found'));
      return rs(product);
    });
  }

  insertProduct(productInput: NewProductInput): Promise<Product> {
    return new Promise(async (rs, rj) => {
      productInput = JSON.parse(JSON.stringify(productInput));
      const createdProduct = await this.PRODUCTS_REPOSITORY.create(
        productInput,
      ).catch(err => {
        rj(err);
      });
      if (!createdProduct || isEmpty(createdProduct))
        return rj(new BadRequestException('Could Not Create Product'));
      return rs(createdProduct);
    });
  }

  productExists(id: string): Promise<Boolean> {
    return new Promise(async (rs, rj) => {
      const product = await this.PRODUCTS_REPOSITORY.findOne({
        where: { id },
      }).catch(err => rj(err));
      if (!product || isEmpty(product)) return rs(false);
      return rs(true);
    });
  }
}
