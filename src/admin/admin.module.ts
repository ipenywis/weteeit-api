import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from '../admin/admin.service';
import { adminsProviders } from './admin.providers';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [AdminController],
  providers: [...adminsProviders, AdminService],
})
export class AdminModule {}
