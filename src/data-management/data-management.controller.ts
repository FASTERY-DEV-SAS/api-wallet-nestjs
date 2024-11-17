import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import { CreateCedulaDto } from './dto/create-cedula.dto';
import { UpdateCedulaDto } from './dto/update-cedula.dto';

@Controller('data-management')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) { }

  @Post('createCedula')
  createCedula(@Body() createCedulaDto: CreateCedulaDto) {
    return this.dataManagementService.createCedula(createCedulaDto);
  }

  @Get('getCedula/:cedula')
  getCedula(@Param('cedula') cedula: string) {
    return this.dataManagementService.getCedula(cedula);
  }
}
