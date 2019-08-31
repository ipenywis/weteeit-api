import { Injectable } from '@nestjs/common';

export interface IConfig {
  usePagination: boolean;
  limitPerPage: number;
  passwordSalt: number;
  jwtKey: string;
  authCookieKey: string;
  authCookieExpiration: Date;
}

@Injectable()
export class ConfigService {
  static DEFAULT_CONFIG: IConfig = {
    usePagination: true,
    limitPerPage: 20,
    passwordSalt: 10,
    jwtKey: process.env.JWT_KEY || '^WE|Tee!it1?3$3%7&@moskotcho$',
    authCookieKey: 'weteeit-auth',
    authCookieExpiration: new Date(Date.now() + 6.048e8), ///< Expiration after 1week
  };

  getDefaultConfig(): IConfig {
    return ConfigService.DEFAULT_CONFIG;
  }
}
