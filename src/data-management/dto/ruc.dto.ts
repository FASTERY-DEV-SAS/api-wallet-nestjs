import { IsString, IsOptional, IsDate, IsUUID, Length, IsEmail, IsIP, IsIn } from 'class-validator';

export class RucDto {
  @IsString()
  @Length(13, 13, { message: 'La identificación debe tener exactamente 13 caracteres.' })
  identificacion: string;

  @IsString()
  @IsIn(['0993392477001', '0940991383', '0993376696001'], { message: 'El convenio no es válido.' })
  convenio: string;

  @IsEmail()
  email: string;
}
