import { IsString, IsOptional, IsDate, IsUUID } from 'class-validator';

export class CreateCedulaDto {
  @IsString()
  identificacion: string;

  @IsString()
  nombreCompleto: string;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  fechaDefuncion?: any;
}
