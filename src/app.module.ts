import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ProductModule } from './products/product.module';
import { DatabaseModule } from './database/database.module';
import { OrderModule } from './orders/order.module';
import { AppController } from './app.controller';
import { ShippingModule } from './shipping/shipping.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      debug: false,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: 'schema.gql',
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    ProductModule,
    OrderModule,
    ShippingModule,
    AdminModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
