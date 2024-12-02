import { IsString, IsOptional, IsDate, IsUUID, Length, IsEmail, IsIP, IsIn } from 'class-validator';

export class CedulaDto {
  @IsString()
  @Length(10, 10, { message: 'La identificación debe tener exactamente 10 caracteres.' })
  identificacion: string;

  @IsString()
  @IsOptional()
  @IsIn(['0993392477001', '0940991383', '0993376696001'], { message: 'El convenio no es válido.' })
  convenio: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
