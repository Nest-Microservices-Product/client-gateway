import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}

  @Post()
  createProduct(@Body() productReq: any) {
    return 'Create a new product ' + productReq;
  }

  @Get()
  findAllProducts() {
    return 'Find all products';
  }

  @Get(':id')
  findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return 'Find one product by id ' + id;
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
    return 'Delete one product by id ' + id;
  }
}
