import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNumber()
  @IsPositive()
  id: number;
}
