import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import { CreateCedulaDto } from './dto/create-cedula.dto';
import { UpdateCedulaDto } from './dto/update-cedula.dto';
import { CedulaDto } from './dto/cedula.dto';
import { RucDto } from './dto/ruc.dto';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) { }

  @Get('getCedula')
  getCedula(@Query() cedulaDto: CedulaDto) {
    return this.dataManagementService.getCedula(cedulaDto);
  }

  @Get('getRuc')
  getRuc(@Query() rucDto: RucDto) {
    return this.dataManagementService.getRuc(rucDto);
  }

}
