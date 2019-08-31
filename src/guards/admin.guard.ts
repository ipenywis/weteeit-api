import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { AuthService, AuthAdmin } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise<boolean>(async (rs, rj) => {
      const request: Request = context.switchToHttp().getRequest();
      const jwtCookieKey = this.configService.getDefaultConfig().authCookieKey;
      const authentication =
        (request.headers[jwtCookieKey] as string) ||
        (request.cookies[jwtCookieKey] as string);
      if (authentication && authentication.toString().trim() !== '') {
        if (authentication.split(' ')[0].toLowerCase() === 'jwt') {
          const token = (authentication as string).split(' ')[1];
          const jwtSecretKey = this.configService.getDefaultConfig().jwtKey;
          //Validate JWT Token
          jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if (err) throw new InternalServerErrorException();
            else if (decoded) {
              this.authService.setAuthenticatedAdmin(decoded as AuthAdmin);
              rs(true);
            } else rs(false);
          });
        } else {
          rs(false);
        }
      } else {
        rs(false);
      }
    });
  }
}
