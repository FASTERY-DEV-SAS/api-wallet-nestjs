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
import { CedulaDto } from './dto/cedula.dto';
import { RucDto } from './dto/ruc.dto';
import { CreateRucDto } from './dto/create-ruc.dto';

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

  // CEDULA
  async getCedula(cedulaDto: CedulaDto): Promise<Cedula> {
    if (cedulaDto.identificacion.length !== 10) {
      throw new BadRequestException('La cédula debe tener exactamente 10 caracteres.');
    }

    if (!this.esCedulaValida(cedulaDto.identificacion)) {
      throw new BadRequestException('La cédula no es válida.');
    }

    try {
      const existingCedula = await this.cedulaRepository.findOne({
        where: { identificacion: cedulaDto.identificacion },
      });

      if (existingCedula) {
        return existingCedula;
      }

      const apiUrl = `https://webservices.ec/api/cedula/${cedulaDto.identificacion}`;
      const headers = {
        Authorization: `Bearer ${envs.tokenWebservices}`,
        Accept: 'application/json',
      };

      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers }),
      );
      this.logger.log(`RESPONDE DE LA CEDULA ${cedulaDto.identificacion}`);

      const apiData = response.data?.data;

      if (!apiData || !apiData.response) {
        throw new NotFoundException(`Cédula ${cedulaDto.identificacion} no encontrada en la API externa.`);
      }

      const apiResponse = apiData.response;

      const createCedulaDto: CreateCedulaDto = {
        identificacion: apiResponse.identificacion,
        nombreCompleto: apiResponse.nombreCompleto,
        nombres: apiResponse.nombres,
        apellidos: apiResponse.apellidos,
        fechaDefuncion: apiResponse.fechaDefuncion || null,
        email: cedulaDto.email || null,
        ip: apiResponse.ip || null,
        convenio: cedulaDto.convenio || null,
      };

      return await this.createCedula(createCedulaDto);
    } catch (error) {
      this.logger.error(`Error en getCedula by ${cedulaDto.identificacion}`, error.stack);
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`La cédula ${cedulaDto.identificacion} no fue encontrada en la API externa.`);
      }
      throw new HttpException(
        error?.response?.data?.message || 'Error al obtener la cédula',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRuc(rucDto: RucDto): Promise<Ruc> {
    if (rucDto.identificacion.length !== 13) {
      throw new BadRequestException('La identificación debe tener exactamente 13 caracteres.');
    }

    try {
      const existingRuc = await this.rucRepository.findOne({
        where: { numeroRuc: rucDto.identificacion },
      });

      if (existingRuc) {
        return existingRuc;
      }

      const apiUrl = `https://webservices.ec/api/ruc/${rucDto.identificacion}`;
      const headers = {
        Authorization: `Bearer ${envs.tokenWebservices}`,
        Accept: 'application/json',
      };

      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers }),
      );

      this.logger.log(`Respuesta del RUC ${rucDto.identificacion}`);

      const apiData = response.data?.data;

      if (!apiData || !apiData.main?.length || !apiData.addit?.length) {
        throw new NotFoundException(`Datos insuficientes en la respuesta de la API para el RUC ${rucDto.identificacion}.`);
      }
      const apiResponseMain = apiData.main[0];
      const apiResponseAddit = apiData.addit;

      const createRucDto: CreateRucDto = {
        email: rucDto.email || null,
        numeroRuc: apiResponseMain.numeroRuc,
        razonSocial: apiResponseMain.razonSocial,
        estadoContribuyenteRuc: apiResponseMain.estadoContribuyenteRuc,
        actividadEconomicaPrincipal: apiResponseMain.actividadEconomicaPrincipal,
        tipoContribuyente: apiResponseMain.tipoContribuyente,
        regimen: apiResponseMain.regimen || null,
        categoria: apiResponseMain.categoria || null,
        obligadoLlevarContabilidad: apiResponseMain.obligadoLlevarContabilidad,
        agenteRetencion: apiResponseMain.agenteRetencion,
        contribuyenteEspecial: apiResponseMain.contribuyenteEspecial,
        informacionFechasContribuyente: {
          fechaInicioActividades: apiResponseMain.informacionFechasContribuyente.fechaInicioActividades || null,
          fechaCese: apiResponseMain.informacionFechasContribuyente.fechaCese || null,
          fechaReinicioActividades: apiResponseMain.informacionFechasContribuyente.fechaReinicioActividades || null,
          fechaActualizacion: apiResponseMain.informacionFechasContribuyente.fechaActualizacion || null,
        },
        representantesLegales: apiResponseMain.representantesLegales?.map((rep) => ({
          identificacion: rep.identificacion,
          nombre: rep.nombre,
        })) || [],
        motivoCancelacionSuspension: apiResponseMain.motivoCancelacionSuspension || null,
        contribuyenteFantasma: apiResponseMain.contribuyenteFantasma,
        transaccionesInexistente: apiResponseMain.transaccionesInexistente,
        establecimientos: apiResponseAddit.map((est) => ({
          nombreFantasiaComercial: est.nombreFantasiaComercial,
          tipoEstablecimiento: est.tipoEstablecimiento,
          direccionCompleta: est.direccionCompleta,
          estado: est.estado,
          numeroEstablecimiento: est.numeroEstablecimiento,
        })),
      };



      return await this.createRuc(createRucDto);
    } catch (error) {
      this.logger.error(`Error en getRuc para ${rucDto.identificacion}`, error.stack);
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`El RUC ${rucDto.identificacion} no fue encontrado en la API externa.`);
      }
      throw new HttpException(
        error?.response?.data?.message || 'Error al obtener el RUC',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


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
  private async createRuc(createRucDto: CreateRucDto): Promise<Ruc> {
    try {
      const rucData = this.rucRepository.create(createRucDto);
      return await this.rucRepository.save(rucData);
    } catch (error) {
      this.logger.error('Error al guardar el RUC en la base de datos', error.stack);
      throw new HttpException(
        'No se pudo guardar el RUC en la base de datos.',
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

  private esRucValido(ruc: string): boolean {
    // El RUC debe tener exactamente 13 caracteres
    if (ruc.length !== 13) {
      return false;
    }

    // Convertir el RUC a un arreglo de números
    const digitos = ruc.split('').map(Number);

    // Verificar que todos los caracteres sean dígitos
    if (digitos.some(isNaN)) {
      return false;
    }

    // Verificar que los dos primeros dígitos correspondan a una provincia válida (01-24)
    const codigoProvincia = parseInt(ruc.substring(0, 2), 10);
    if (codigoProvincia < 1 || codigoProvincia > 24) {
      return false;
    }

    // Determinar el tipo de contribuyente según el tercer dígito
    const tipoContribuyente = digitos[2];

    if (tipoContribuyente < 0 || tipoContribuyente > 9) {
      return false; // Tercer dígito inválido
    }

    if (tipoContribuyente < 6) {
      // Validación para personas naturales (similar a la cédula)
      return this.esCedulaValida(ruc.substring(0, 10));
    } else if (tipoContribuyente === 6) {
      // Validación para sociedades públicas
      const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
      const suma = digitos.slice(0, 8).reduce((acc, val, index) => acc + val * coeficientes[index], 0);
      const digitoVerificador = 11 - (suma % 11);
      return digitoVerificador === digitos[8];
    } else if (tipoContribuyente === 9) {
      // Validación para sociedades privadas y extranjeras
      const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
      const suma = digitos.slice(0, 9).reduce((acc, val, index) => acc + val * coeficientes[index], 0);
      const digitoVerificador = 11 - (suma % 11);
      return digitoVerificador === digitos[9];
    }

    // Verificar que los últimos tres dígitos sean "001" para RUC válido
    const codigoEstablecimiento = parseInt(ruc.substring(10, 13), 10);
    return codigoEstablecimiento === 1;
  }



}
