import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'empresa@fastery.dev',
    description: 'The email of the user.',
    nullable: false,
  })
  @IsEmail(
    {},
    {
      message: 'El email ingresado no es válido.',
    }
  )
  email: string;

  @ApiProperty({
    example: 'Fastery2025.',
    description: 'The password of the user.',
    nullable: false,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(50, {
    message: 'La contraseña debe tener menos de 50 caracteres.',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, una minúscula y un número.',
  })
  password: string;
}
