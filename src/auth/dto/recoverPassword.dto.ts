import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";

export class RecoverPasswordDto {
    @IsString()
    @IsStrongPassword()
    @ApiProperty({
        example: 'P@ssword0708',
        description: 'Nueva contraseña del usuario',
    })
    password: string;
}