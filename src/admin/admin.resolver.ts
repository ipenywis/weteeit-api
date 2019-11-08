import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthAdmin, AuthService } from '../auth/auth.service';
import { GqlAuthGuard } from '../guards/admin.guard';
import { AdminService } from './admin.service';
import { Admin } from './models/admin';

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
