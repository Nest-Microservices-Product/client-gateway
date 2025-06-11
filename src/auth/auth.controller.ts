import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AUTH_SERVICES_NAMES } from './entities/AuthServicesNames';
import { catchError } from 'rxjs';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { GetUser, GetToken } from './decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RecoverPasswordDto } from './dto/recoverPassword.dto';

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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar la contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada.' })
  @UseGuards(AuthGuard)
  @Post('recover')
  async recoverPassword(@Body() recoverPassword: RecoverPasswordDto, @GetToken() token: string) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.RECOVER_PASSWORD }, { password: recoverPassword.password, token})
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @ApiOperation({ summary: 'Conseguir token para recuperar contraseña' })
  @ApiResponse({ status: 200, description: 'Token obtenido.' })
  @ApiParam({ name : 'email', type : String})
  @Post('recover/:email')
  async getTokenRecoverPassword(@Param('email') email: string) {
    return await this.client
      .send({ cmd: AUTH_SERVICES_NAMES.TOKEN_PASSWORD }, email)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }


}
