import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/getEnvs';
import { ORDERS_SERVICES_NAMES } from './entities/OrdersServicesNames';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICES_NAMES.SERVICE_NAME,
        transport: Transport.TCP,
        options: {
          host: envs.ordersMsHost,
          port: envs.ordersMSPort,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [],
})
export class OrdersModule {}
