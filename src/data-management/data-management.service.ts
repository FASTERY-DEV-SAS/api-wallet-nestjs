import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  private async createCedula(createCedulaDto: CreateCedulaDto): Promise<Cedula> {
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
    if (cedula.length !== 10) {
      throw new BadRequestException('La cédula debe tener exactamente 10 caracteres.');
    }

    if (!this.esCedulaValida(cedula)) {
      throw new BadRequestException('La cédula no es válida.');
    }

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

      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers }),
      );

      const apiData = response.data?.data;

      if (!apiData || !apiData.response) {
        throw new NotFoundException(`Cédula ${cedula} no encontrada en la API externa.`);
      }

      const apiResponse = apiData.response;

      const createCedulaDto: CreateCedulaDto = {
        identificacion: apiResponse.identificacion,
        nombreCompleto: apiResponse.nombreCompleto,
        nombres: apiResponse.nombres,
        apellidos: apiResponse.apellidos,
        fechaDefuncion: apiResponse.fechaDefuncion || null,
      };

      return await this.createCedula(createCedulaDto);
    } catch (error) {
      this.logger.error(`Error en getCedula by ${cedula}`, error.stack);
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`La cédula ${cedula} no fue encontrada en la API externa.`);
      }
      throw new HttpException(
        error?.response?.data?.message || 'Error al obtener la cédula',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private esCedulaValida(cedula: string): boolean {
    // Verificar que la cédula tenga exactamente 10 dígitos
    if (cedula.length !== 10) {
      return false;
    }

    // Convertir la cédula a un arreglo de números
    const digitos = cedula.split('').map(Number);

    // Verificar que todos los caracteres sean dígitos
    if (digitos.some(isNaN)) {
      return false;
    }

    // Verificar que los dos primeros dígitos correspondan a una provincia válida (01-24)
    const codigoProvincia = parseInt(cedula.substring(0, 2), 10);
    if (codigoProvincia < 1 || codigoProvincia > 24) {
      return false;
    }

    // Verificar que el tercer dígito sea menor a 6
    if (digitos[2] >= 6) {
      return false;
    }

    // Coeficientes para la validación
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];

    // Calcular la suma de los productos
    const suma = digitos.slice(0, 9).reduce((acc, val, index) => {
      let producto = val * coeficientes[index];
      if (producto >= 10) {
        producto -= 9;
      }
      return acc + producto;
    }, 0);

    // Obtener el dígito verificador
    const digitoVerificador = (10 - (suma % 10)) % 10;

    // Comparar el dígito verificador con el décimo dígito de la cédula
    return digitoVerificador === digitos[9];
  }




}
