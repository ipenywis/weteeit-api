import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { Op } from 'sequelize';
import { IFindOptions } from 'sequelize-typescript';
import { ConfigService, IConfig } from '../config/config.service';
import { PaginationService } from '../pagination/pagination.service';
import { ProductsWithPagination } from '../products/types';
import { randomTimeKey } from '../utils/common';
import { ProductInput } from './dto/product.input';
import { Product } from './models/product';

@Injectable()
export class ProductService {
  private readonly defaultConfig: IConfig;

  constructor(
    private readonly configSerivce: ConfigService,
    private readonly paginationService: PaginationService,
    @Inject('PRODUCTS_REPOSITORY')
    private readonly PRODUCTS_REPOSITORY: typeof Product,
  ) {
    //Quick Access for Default Config
    this.defaultConfig = this.configSerivce.getDefaultConfig();
  }

  getProductsRepository(): typeof Product {
    return this.PRODUCTS_REPOSITORY;
  }

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
      const product = await this.PRODUCTS_REPOSITORY.findOne({
        where: { name },
      }).catch(err => rj(new InternalServerErrorException()));
      if (!product || isEmpty(product))
        return rj(new NotFoundException('Product Not Found'));
      return rs(product);
    });
  }

  findAllByName(
    names: string[],
    options?: IFindOptions<Product>,
  ): Promise<Product[]> {
    return new Promise(async (rs, rj) => {
      const products = await this.PRODUCTS_REPOSITORY.findAll({
        ...(options as any),
        where: { name: { [Op.in]: names } } as any,
      }).catch(err => {
        console.log('Error: ', err);
        rj(new InternalServerErrorException(err));
      });
      if (!products || isEmpty(products))
        return rj(new NotFoundException('Products Not Found'));
      return rs(products);
    });
  }

  findByType(
    type: string,
    pageId?: number,
    limitPerPage?: number,
  ): Promise<ProductsWithPagination> {
    return new Promise(async (rs, rj) => {
      const queryConfig = this.paginationService.generateQuery(
        pageId,
        limitPerPage,
      );
      const products = await this.PRODUCTS_REPOSITORY.findAll({
        ...queryConfig,
        where: { type },
      }).catch(err => rj(err));
      if (!products || isEmpty(products))
        return rj(
          new NotFoundException('Products Not Found with specified type'),
        );
      const paginationMetadata = await this.paginationService
        .paginate<Product>({ where: { type } }, this.PRODUCTS_REPOSITORY)
        .catch(err => rj(new InternalServerErrorException()));
      if (paginationMetadata)
        return rs({ products: products, pagination: paginationMetadata });
      else return rs({ products: products, pagination: null });
    });
  }

  insertProduct(productInput: ProductInput): Promise<Product> {
    return new Promise(async (rs, rj) => {
      productInput = JSON.parse(JSON.stringify(productInput));
      //Generate Unique Random Key
      const randomKey = randomTimeKey();
      const createdProduct = await this.PRODUCTS_REPOSITORY.create({
        ...productInput,
        key: randomKey,
      }).catch(err => {
        rj(err);
      });
      if (!createdProduct || isEmpty(createdProduct))
        return rj(new BadRequestException('Could Not Create Product'));
      return rs(createdProduct);
    });
  }

  updateProduct(id: number, productInput: ProductInput): Promise<Product> {
    return new Promise(async (rs, rj) => {
      productInput = JSON.parse(JSON.stringify(productInput));
      const updatedResult = await this.PRODUCTS_REPOSITORY.update(
        productInput,
        { where: { id } },
      ).catch(err => rj(err));
      if (!updatedResult || isEmpty(updatedResult))
        return rj(new BadRequestException('Could Not Update Product'));
      //NOTE: Sequezlie Update method returns iterable array of [updatedNumber, updatedProduct[]]
      else return rs({ id, ...productInput } as Product);
    });
  }

  productExists(name: string): Promise<boolean> {
    return new Promise(async (rs, rj) => {
      const product = await this.PRODUCTS_REPOSITORY.findOne({
        where: { name },
      }).catch(err => rj(err));
      if (!product || isEmpty(product)) return rs(false);
      return rs(true);
    });
  }

  deleteProduct(name: string): Promise<boolean> {
    return new Promise(async (rs, rj) => {
      const product = await this.PRODUCTS_REPOSITORY.destroy({
        where: { name },
      }).catch(err => rj(err));
      if (!product) return rs(false);
      else return rs(true);
    });
  }
}
