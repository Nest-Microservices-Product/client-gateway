import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { OrderStatus } from '../entities/orderStatus.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPaginationDto extends PaginationDto {
  @ApiProperty({
    example: OrderStatus.PENDING,
    description: 'Status of the order',
    type: String,
    enum: OrderStatus,
    required: false,
  })
  @IsEnum(OrderStatus, {
    message: `The values for the order status are PENDING, DELIVERED, CANCELLED, PAID`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
}
