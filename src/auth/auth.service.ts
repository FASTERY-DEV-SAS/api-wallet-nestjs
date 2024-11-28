import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ApiKey } from './entities/apikey.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApiKey)
    private readonly apikeyRepository: Repository<ApiKey>,
    private readonly jwtService: JwtService,
  ) { }
  // USER++
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        message: 'Usuario registrado con éxito.'
      };
    } catch (error) {
      this.logger.error(`Error in register ${createUserDto.userName}`);
      if (error instanceof BadRequestException) {
        error.message || 'Ocurrió un error al registrar el usuario.';
      } else {
        throw new InternalServerErrorException(
          error.message || 'Ocurrió un error al registrar el usuario.',
        );
      }
    }
  }
  // USER++
  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email, isActive: true },
        select: { email: true, password: true, id: true, userName: true, roles: true },
      });

      if (!user)
        throw new UnauthorizedException('Credenciales inválidas (email)');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credeciales inválidas (password)');
      delete user.password;
      return {
        ...user,
        accessToken: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      this.logger.error(`Error in login ${loginUserDto.email}`, error);
      if (error instanceof BadRequestException) {
        error.message || 'Ocurrió un error al registrar el usuario.';
      } else {
        throw new InternalServerErrorException(
          error.message || 'Ocurrió un error al registrar el usuario.',
        );
      }
    }
  }
  // USER++
  async getUserData(user: User) {
    try {
      const userData = await this.userRepository.findOne({
        where: { id: user.id },
      });
      return userData;
    } catch (error) {
      this.logger.error(`Error in getUserData UserId: ${user.id}`);
      if (error instanceof BadRequestException) {
        error.message || 'Ocurrió un error al registrar el usuario.';
      } else {
        throw new InternalServerErrorException(
          error.message || 'Ocurrió un error al registrar el usuario.',
        );
      }
    }
  }
  // CERRAR SESIÓN
  // REFRESCAR TOKEN
  async checkAuthStatus(user: User) {
    return {
      ...user,
      accessToken: this.getJwtToken({ id: user.id }),
    };
  }
  // SERVER++
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async createApiKeyId(data: any, user: User) {
    try {
      const apiKey = this.apikeyRepository.create({
        key: "FASTERY2025",
        user: user,
      });
      await this.apikeyRepository.save(apiKey);

      return {
        message: 'ApiKey actualizada con éxito',
        data: data
      };
    } catch (error) {
      this.logger.error(`Error in editApiKeyId ${data.id}`, error);
      throw new InternalServerErrorException(
        error.message || 'Ocurrió un error al editar la ApiKey.',
      );
    }
  }
}
