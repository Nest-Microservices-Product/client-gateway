import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123',
    required: true,
  })
  @IsString()
  userId: string;
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Perez',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'P@ssword0708',
    required: false,
  })
  @IsString()
  @IsStrongPassword()
  @IsOptional()
  password: string;
}
