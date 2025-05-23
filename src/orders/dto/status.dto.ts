import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/orderStatus.entity';
import { ApiProperty } from '@nestjs/swagger';

export class StatusDto {
  @ApiProperty({
    example: OrderStatus.PENDING,
    description: 'Status of the order',
    type: String,
    enum: OrderStatus,
    required: true,
  })
  @IsEnum(OrderStatus, {
    message: `The values for the order status are PENDING, DELIVERED, CANCELLED`,
  })
  @IsOptional()
  status: OrderStatus;
}
