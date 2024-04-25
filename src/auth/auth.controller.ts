import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AUTH_SERVICES_NAMES } from './entities/AuthServicesNames';
import { catchError } from 'rxjs';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}
  @Post('register')
  async registerUser(@Body() registerUserReq: RegisterUserDto) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.REGISTER_USER }, registerUserReq)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Post('login')
  async loginUser(@Body() loginUserReq: LoginUserDto) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.LOGIN_USER }, loginUserReq)
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
