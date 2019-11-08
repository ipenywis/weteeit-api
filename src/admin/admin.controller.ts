import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response as EResponse } from 'express';
import { AdminService } from '../admin/admin.service';
import { LoginDTO } from '../admin/dto/login.dto';
import { CreateAdminDTO } from '../admin/dto/register.dto';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from '../guards/admin.guard';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import Response from '../responses/response';
import { Admin } from './models/admin';

@Controller('admin')
@UseInterceptors(ResponseInterceptor)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO, @Res() response: EResponse) {
    const jwtToken = await this.adminService.login(loginDTO).catch(err => {
      throw err;
    });

    //Set Response Session Cookie
    const authCookieKey = this.configService.getDefaultConfig().authCookieKey;
    const cookieJwtToken = this.adminService.prepareJWTCookie(jwtToken);
    if (loginDTO.rememberMe) {
      //Remember Admin
      const expirationDate = this.configService.getDefaultConfig()
        .authCookieExpiration;
      response.cookie(authCookieKey, cookieJwtToken, {
        expires: expirationDate,
      });
    } else {
      //Session-Cookie
      response.cookie(authCookieKey, cookieJwtToken);
    }
    response.send(
      new Response({ jwtToken: jwtToken }, 'Admin Successfully Logged-in'),
    );
  }

  @Post('register')
  @UseGuards(AuthGuard)
  async register(@Body() createAdminDTO: CreateAdminDTO) {
    const isAdminExists = await this.adminService
      .adminExists(createAdminDTO.username, createAdminDTO.email)
      .catch((err: Error) => {
        throw new InternalServerErrorException();
      });
    if (isAdminExists)
      throw new ConflictException('Admin with email/username already exists');
    //Store Admin
    const admin = await this.adminService
      .storeAdmin(createAdminDTO)
      .catch(err => {
        throw new InternalServerErrorException();
      });
    return new Response<Admin>(admin, 'Admin Successfully Registered!');
  }

  @Get('verify/:token')
  async verifyToken(@Param('token') token: string) {
    const isValid = await this.adminService.verifyToken(token).catch(err => {
      throw err;
    });

    return new Response(
      { valid: isValid },
      isValid ? 'Token is valid' : 'Token is invalid',
    );
  }
}
