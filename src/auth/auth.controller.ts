import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AUTH_SERVICES_NAMES } from './entities/AuthServicesNames';
import { catchError } from 'rxjs';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { GetUser, GetToken } from './decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NAST_SERVICE)
    private readonly client: ClientProxy,
  ) {}
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
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
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado.' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Usuario verificado.' })
  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyUser(@GetUser() user: unknown, @GetToken() token: string) {
    return { token, user };
  }
}
