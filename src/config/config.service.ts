import { Injectable } from '@nestjs/common';

export interface IConfig {
  usePagination: boolean;
  limitPerPage: number;
}

@Injectable()
export class ConfigService {
  static DEFAULT_CONFIG: IConfig = {
    usePagination: true,
    limitPerPage: 20,
  };

  getDefaultConfig(): IConfig {
    return ConfigService.DEFAULT_CONFIG;
  }
}
