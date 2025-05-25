import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { USERS_SERVICES_NAMES } from './entities/UsersServicesNames';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { catchError } from 'rxjs';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(NAST_SERVICE) private readonly client: ClientProxy) {}

  @ApiOperation({ summary: 'Buscar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.client.send({ cmd: USERS_SERVICES_NAMES.FIND_USER }, id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.client
      .send(
        { cmd: USERS_SERVICES_NAMES.UPDATE_USER },
        { ...updateUserDto, userId: id },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.client.send({ cmd: USERS_SERVICES_NAMES.DELETE_USER }, id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
