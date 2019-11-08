import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PaginationService } from './pagination.service';

@Module({
  imports: [ConfigModule],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
