import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { UsersModule } from './users/users.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    AuthModule,
    ShoppingCartModule,
    UsersModule,
    HealthCheckModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
