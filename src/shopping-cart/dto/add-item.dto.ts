import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
  @ApiProperty({
    example: 1,
    description: 'ID del producto',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @ApiProperty({
    example: 1,
    description: 'Cantidad del producto',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @ApiProperty({
    example: 1,
    description: 'Precio del producto',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
