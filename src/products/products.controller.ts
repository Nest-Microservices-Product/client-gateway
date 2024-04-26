import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCTS_SERVICES_NAMES } from './entities/ProductsServicesNames';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { catchError } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from './dto';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() productReq: CreateProductDto) {
    return this.client
      .send({ cmd: PRODUCTS_SERVICES_NAMES.CREATE_PRODUCT }, productReq)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client
      .send({ cmd: PRODUCTS_SERVICES_NAMES.FIND_ALL_PRODUCTS }, paginationDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get(':id')
  findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client
      .send({ cmd: PRODUCTS_SERVICES_NAMES.FIND_ONE_PRODUCT }, id)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productReq: UpdateProductDto,
  ) {
    return this.client
      .send(
        { cmd: PRODUCTS_SERVICES_NAMES.UPDATE_PRODUCT },
        {
          id,
          ...productReq,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client
      .send({ cmd: PRODUCTS_SERVICES_NAMES.DELETE_PRODUCT }, id)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
