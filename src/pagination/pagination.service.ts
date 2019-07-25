import { Injectable } from '@nestjs/common';
import { ConfigService, IConfig } from '../config/config.service';
import { Model } from 'sequelize';
import { Product } from '../products/models/product';
import { Order } from '../orders/models/order';
import { IPaginationMetadata } from '../typings/types';

export interface IPaginationQuery {
  limit: number;
  offset: number;
}

type TargetModel = typeof Product | typeof Order;

@Injectable()
export class PaginationService {
  private readonly defaultConfig: IConfig;
  private targetModel: TargetModel;
  private lastPaginationQuery: IPaginationQuery;
  private lastPageId: number;

  constructor(private readonly configService: ConfigService) {
    this.defaultConfig = this.configService.getDefaultConfig();
    //Default target model
    this.targetModel = Product;
  }

  generateQuery(pageId: number, limitPerPage: number): IPaginationQuery {
    this.lastPageId = pageId;
    if (!pageId || pageId <= 0) return { limit: undefined, offset: 0 };
    return (this.lastPaginationQuery = {
      limit: limitPerPage || this.defaultConfig.limitPerPage,
      offset: (pageId - 1) * (limitPerPage || this.defaultConfig.limitPerPage),
    });
  }

  /**
   * Make sure to call generateQuery before calling paginate
   * Query metadata needed for pagination
   * @param targetModel
   */
  async paginate(
    targetModel?: TargetModel,
  ): Promise<IPaginationMetadata | null> {
    try {
      let useModel = this.targetModel;
      if (targetModel) useModel = targetModel;
      //Find Count
      let count: number | void = 0;
      //Count Number of Records
      count = await (useModel as any).count({ where: {} }).catch(err => {
        throw err;
      });

      const numPages =
        ((count as number) || 0) / this.lastPaginationQuery.limit ||
        this.defaultConfig.limitPerPage;
      const perPage =
        this.lastPaginationQuery.limit || this.defaultConfig.limitPerPage;
      const pageId = this.lastPageId;
      return { numPages, perPage, pageId };
    } catch (err) {
      return null;
    }
  }
}