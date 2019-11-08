import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthAdmin, AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export abstract class AbstractAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  protected abstract getRequest(context: ExecutionContext): Request;

  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise<boolean>(async (rs, rj) => {
      //Set Default authenticated to null
      this.authService.setAuthenticatedAdmin(null);
      const request: Request = this.getRequest(context);
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

export class AuthGuard extends AbstractAuthGuard {
  constructor(configService: ConfigService, authService: AuthService) {
    super(configService, authService);
  }

  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }
}

export class GqlAuthGuard extends AbstractAuthGuard {
  constructor(configService: ConfigService, authService: AuthService) {
    super(configService, authService);
  }

  getRequest(context: ExecutionContext): Request {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
