import {
  Post,
  UseGuards,
  Controller,
  Body,
  InternalServerErrorException,
  ConflictException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/admin.guard';
import { CreateAdminDTO } from '../admin/dto/register.dto';
import { AdminService } from '../admin/admin.service';
import Response from '../responses/response';
import { Admin } from './models/admin';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { LoginDTO } from '../admin/dto/login.dto';

@Controller('admin')
@UseInterceptors(ResponseInterceptor)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const jwtToken = await this.adminService.login(loginDTO).catch(err => {
      throw err;
    });
    return new Response({ token: jwtToken }, 'Admin Successfully Logged-in');
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
