import { PartialType } from '@nestjs/swagger';
import { CreateCedulaDto } from './create-cedula.dto';

export class UpdateCedulaDto extends PartialType(CreateCedulaDto) {}
