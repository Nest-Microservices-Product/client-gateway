import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/orderStatus.entity';

export class StatusDto {
  @IsEnum(OrderStatus, {
    message: `The values for the order status are PENDING, DELIVERED, CANCELLED`,
  })
  @IsOptional()
  status: OrderStatus;
}
