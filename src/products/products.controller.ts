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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('products')
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
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

  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
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

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto encontrado.' })
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

  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto actualizado.' })
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

  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto eliminado.' })
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
