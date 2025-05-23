import {
  Controller,
  Get,
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
import { OrderPaginationDto, StatusDto } from './dto';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('orders')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de órdenes.' })
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

  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Orden encontrada.' })
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

  @ApiOperation({ summary: 'Obtener todas las órdenes de un usuario' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: 'Órdenes del usuario.' })
  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.client
      .send({ cmd: ORDERS_SERVICES_NAMES.FIND_ALL_ORDERS_BY_USER }, userId)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  
  @ApiOperation({ summary: 'Cambiar el estado de una orden' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Estado de la orden actualizado.' })
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
