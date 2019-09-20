import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  BadRequestException,
  HttpException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Admin } from './models/admin';
import { AdminService } from './admin.service';
import { GqlAuthGuard } from '../guards/admin.guard';
import { AuthService, AuthAdmin } from '../auth/auth.service';

@Resolver(of => Admin)
@UseGuards(GqlAuthGuard)
//@UseFilters(SequelizeExceptionFilter)
export class AdminResolver {
  constructor(
    private readonly adminSerivce: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Query(returns => AuthAdmin, { name: 'getAuthenticated', nullable: true })
  getAuthenticatedAdmin() {
    if (this.authService.isAuthenticated()) {
      return this.authService.getAuthenticatedAdmin();
    } else return null;
  }
}
