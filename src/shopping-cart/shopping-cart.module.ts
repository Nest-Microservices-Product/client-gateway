import { Module } from "@nestjs/common";
import { NatsModule } from "src/transports/nats.module";
import { ShoppingCartController } from "./shopping-cart.controller";

@Module({
  imports: [NatsModule],
  controllers: [ShoppingCartController],
  providers: [],
})
export class ShoppingCartModule {}
