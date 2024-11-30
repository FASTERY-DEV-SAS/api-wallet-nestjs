import { IsString, IsOptional, IsDate, IsUUID, Length, IsEmail, IsIP } from 'class-validator';

export class CreateCedulaDto {
  @IsString()
  @Length(10, 10, { message: 'La identificación debe tener exactamente 10 caracteres.' })
  identificacion: string;

  @IsString()
  nombreCompleto: string;

  @IsString()
  nombres: string;

  @IsEmail()
  email: string;

  @IsIP()
  @IsOptional()
  ip?: string;

  @IsString()
  convenio: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  fechaDefuncion?: string;
}
