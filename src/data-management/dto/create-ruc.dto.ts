import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsUUID, Length, IsEmail, IsIP, ValidateNested, IsArray } from 'class-validator';
class EstablishmentDto {
  @IsString()
  nombreFantasiaComercial: string;

  @IsString()
  tipoEstablecimiento: string;

  @IsString()
  direccionCompleta: string;

  @IsString()
  estado: string;

  @IsString()
  numeroEstablecimiento: string;
}
class InformacionFechasContribuyenteDto {
  @IsString()
  fechaInicioActividades: string;

  @IsOptional()
  fechaCese: any;

  @IsOptional()
  fechaReinicioActividades: any;

  @IsString()
  fechaActualizacion: string;
}
export class RepresentativeDto {
  @IsString()
  @Length(10, 10, { message: 'La identificación del representante debe tener exactamente 10 caracteres.' })
  identificacion: string;

  @IsString()
  nombre: string;
}
export class CreateRucDto {
  @IsString()
  numeroRuc: string;

  @IsString()
  razonSocial: string;

  @IsEmail()
  email: string;

  @IsString()
  estadoContribuyenteRuc: string;

  @IsString()
  actividadEconomicaPrincipal: string;

  @IsString()
  tipoContribuyente: string;

  @IsOptional()
  @IsString()
  regimen?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsString()
  obligadoLlevarContabilidad: string;

  @IsString()
  agenteRetencion: string;

  @IsString()
  contribuyenteEspecial: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => InformacionFechasContribuyenteDto)
  informacionFechasContribuyente?: InformacionFechasContribuyenteDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepresentativeDto)
  representantesLegales?: RepresentativeDto[];

  @IsOptional()
  @IsString()
  motivoCancelacionSuspension?: string;

  @IsString()
  contribuyenteFantasma: string;

  @IsString()
  transaccionesInexistente: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EstablishmentDto)
  establecimientos?: EstablishmentDto[];
}

