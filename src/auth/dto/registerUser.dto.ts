import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nombre del usuario' })
  @IsString()
  name: string;
  @ApiProperty({ example: 'test@test.com', description: 'Email del usuario' })
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'P@ssword0708',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
