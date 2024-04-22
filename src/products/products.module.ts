import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/getEnvs';
import { PRODUCTS_SERVICES_NAMES } from './entities/ProductsServicesNames';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICES_NAMES.SERVICE_NAME,
        transport: Transport.TCP,
        options: {
          host: envs.productsMsHost,
          port: envs.productsMsPort,
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
