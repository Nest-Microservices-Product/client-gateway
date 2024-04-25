import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AUTH_SERVICES_NAMES } from './entities/AuthServicesNames';
import { catchError } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}
  @Post('register')
  async registerUser(@Body() reqAuth: any) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.REGISTER_USER }, reqAuth)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Post('login')
  async loginUser(@Body() reqAuth: any) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.LOGIN_USER }, reqAuth)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Post('verify')
  async verifyUser(@Body() reqAuth: any) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.VERIFY_TOKEN }, reqAuth)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
