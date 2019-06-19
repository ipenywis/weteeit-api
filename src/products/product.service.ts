import { Injectable } from '@nestjs/common';
import { Product } from 'dist/Product/product.graphql';

@Injectable()
export class ProductService {
  findOneById(id: string): Promise<Product> {
    return null;
  }
}
