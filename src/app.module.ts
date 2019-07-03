import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ProductModule } from './products/product.module';
import { DatabaseModule } from './database/database.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      debug: true,
      playground: true,
      autoSchemaFile: 'schema.gql',
      introspection: true,
    }),
    ProductModule,
    OrderModule,
  ],
  providers: [AppService],
})
export class AppModule {}
