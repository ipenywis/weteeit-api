import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
