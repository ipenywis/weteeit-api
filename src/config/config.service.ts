import { Injectable } from '@nestjs/common';

export interface IConfig {
  usePagination: boolean;
  limitPerPage: number;
  passwordSalt: number;
  jwtKey: string;
}

@Injectable()
export class ConfigService {
  static DEFAULT_CONFIG: IConfig = {
    usePagination: true,
    limitPerPage: 20,
    passwordSalt: 10,
    jwtKey: process.env.JWT_KEY || '^WE|Tee!it1?3$3%7&@moskotcho$',
  };

  getDefaultConfig(): IConfig {
    return ConfigService.DEFAULT_CONFIG;
  }
}
