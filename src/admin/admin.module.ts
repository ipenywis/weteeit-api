import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from '../admin/admin.service';
import { adminsProviders } from './admin.providers';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { AdminResolver } from './admin.resolver';

@Module({
  imports: [ConfigModule, AuthModule, ConfigModule],
  controllers: [AdminController],
  providers: [...adminsProviders, AdminService, AdminResolver],
})
export class AdminModule {}
