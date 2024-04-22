import {
  BadRequestException,
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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICES_NAMES } from './entities/ProductsServicesNames';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICES_NAMES.SERVICE_NAME)
    private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() productReq: any) {
    return 'Create a new product ' + productReq;
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: PRODUCTS_SERVICES_NAMES.FIND_ALL_PRODUCTS },
      paginationDto,
    );
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send(
          { cmd: PRODUCTS_SERVICES_NAMES.FIND_ONE_PRODUCT },
          id,
        ),
      );
      return product;
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productReq: any,
  ) {
    return 'update one product by id ' + id + ' ' + productReq;
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send(
      { cmd: PRODUCTS_SERVICES_NAMES.DELETE_PRODUCT },
      id,
    );
  }
}
