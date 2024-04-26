import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ORDERS_SERVICES_NAMES } from './entities/OrdersServicesNames';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client
      .send({ cmd: ORDERS_SERVICES_NAMES.CREATE_ORDER }, createOrderDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    return this.client
      .send({ cmd: ORDERS_SERVICES_NAMES.FIND_ALL_ORDERS }, paginationDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client
      .send({ cmd: ORDERS_SERVICES_NAMES.FIND_ONE_ORDER }, id)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: number,
    @Body() statusReq: StatusDto,
  ) {
    return this.client
      .send(
        { cmd: ORDERS_SERVICES_NAMES.CHANGE_STATUS },
        {
          id,
          status: statusReq.status,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
