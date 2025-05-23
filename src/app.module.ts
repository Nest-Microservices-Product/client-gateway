import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';

@Module({
  imports: [ProductsModule, OrdersModule, AuthModule, ShoppingCartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
