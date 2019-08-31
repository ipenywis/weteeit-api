import {
  Post,
  UseGuards,
  Controller,
  Body,
  InternalServerErrorException,
  ConflictException,
  UseInterceptors,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../guards/admin.guard';
import { CreateAdminDTO } from '../admin/dto/register.dto';
import { AdminService } from '../admin/admin.service';
import Response from '../responses/response';
import { Admin } from './models/admin';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { LoginDTO } from '../admin/dto/login.dto';
import { AuthService } from '../auth/auth.service';
import { Response as EResponse, Request as ERequest } from 'express';
import { ConfigService } from '../config/config.service';

@Controller('admin')
@UseInterceptors(ResponseInterceptor)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  //@UseGuards(AuthGuard)
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
}
