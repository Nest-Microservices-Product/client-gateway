import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Camiseta', description: 'Nombre del producto' })
  @IsString()
  name: string;
  @ApiProperty({ example: 19.99, description: 'Precio del producto' })
  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => Number)
  price: number;
}
