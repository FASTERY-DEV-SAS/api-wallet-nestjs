import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCedulaDto } from './dto/create-cedula.dto';
import { UpdateCedulaDto } from './dto/update-cedula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cedula } from './entities/cedula.entity';
import { Ruc } from './entities/ruc.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config';

@Injectable()
export class DataManagementService {
  private readonly logger = new Logger('DataManagementService');
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(Cedula, 'data-management')
    private readonly cedulaRepository: Repository<Cedula>,

    @InjectRepository(Ruc, 'data-management')
    private readonly rucRepository: Repository<Ruc>,
  ) { }

  async createCedula(createCedulaDto: CreateCedulaDto): Promise<Cedula> {
    try {
      const cedula = this.cedulaRepository.create(createCedulaDto);
      return await this.cedulaRepository.save(cedula);
    } catch (error) {
      throw new HttpException(
        'Error al guardar la cédula en la base de datos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCedula(cedula: string): Promise<Cedula> {
    try {
      const existingCedula = await this.cedulaRepository.findOne({
        where: { identificacion: cedula },
      });

      if (existingCedula) {
        return existingCedula;
      }

      const apiUrl = `https://webservices.ec/api/cedula/${cedula}`;
      const token = envs.tokenWebservices;

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };

      // Realizar la solicitud a la API externa
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers }),
      );

      // Corregir acceso a los datos de la API
      console.log("response", response.data);
      const apiData = response.data?.data; // Acceso a la propiedad `data`
      console.log("apiData", apiData);

      if (!apiData || !apiData.response) {
        throw new NotFoundException(`Cédula ${cedula} no encontrada en la API externa.`);
      }

      const apiResponse = apiData.response;

      // Construir el DTO para guardar en la base de datos
      const createCedulaDto: CreateCedulaDto = {
        identificacion: apiResponse.identificacion,
        nombreCompleto: apiResponse.nombreCompleto,
        nombres: apiResponse.nombres,
        apellidos: apiResponse.apellidos,
        fechaDefuncion: apiResponse.fechaDefuncion || null,
      };

      // Guardar en la base de datos y devolver el resultado
      return await this.createCedula(createCedulaDto);
    } catch (error) {
      this.logger.error(`Error en getCedula by ${cedula}`, error.stack);

      // Manejo de errores específicos
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`La cédula ${cedula} no fue encontrada en la API externa.`);
      }

      // Lanza un error genérico para otros casos
      throw new HttpException(
        error?.response?.data?.message || 'Error al obtener la cédula',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }




}
