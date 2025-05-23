import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { SHOPPING_CART_SERVICES_NAMES } from './entities/ShoppingCartServicesNames';
import { AddItemDto } from './dto/add-item.dto';
import { catchError } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(AuthGuard)
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(@Inject(NAST_SERVICE) private readonly client: ClientProxy) {}

  @Post('add-item')
  addItem(@Body() addItemDto: AddItemDto) {
    return this.client
      .send(
        {
          cmd: SHOPPING_CART_SERVICES_NAMES.ADD_ITEM,
        },
        addItemDto,
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Post('create-order')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client
      .send(
        {
          cmd: SHOPPING_CART_SERVICES_NAMES.GIVE_ORDER,
        },
        createOrderDto.userId,
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
