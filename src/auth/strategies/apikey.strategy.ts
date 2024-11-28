import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../entities/apikey.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
    constructor(
        @InjectRepository(ApiKey)
        private readonly apiKeyRepository: Repository<ApiKey>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({ header: 'Authorization', prefix: 'Api-Key ' }, true, async (apiKey, done, req) => {
            try {
                // Buscar la clave API en la base de datos
                const apiKeyEntity = await this.apiKeyRepository.findOne({
                    where: { key: apiKey, isActive: true },
                    relations: ['user'],
                });
                console.log(apiKeyEntity);

                if (!apiKeyEntity) {
                    return done(new UnauthorizedException('Invalid API Key'), false);
                }

                // Obtener la IP del cliente desde el request
                // const clientIp = this.getRequestIp(req);
                // console.log(clientIp);
                // if (
                //     apiKeyEntity.allowedIps.length > 0 && // Si hay restricciones de IP
                //     !apiKeyEntity.allowedIps.includes(clientIp) // Y la IP del cliente no está en la lista
                // ) {
                //     return done(new ForbiddenException(`IP ${clientIp} is not allowed`), false);
                // }

                // Validar si el usuario está activo
                const user = apiKeyEntity.user;
                if (!user.isActive) {
                    return done(new UnauthorizedException('User is not active'), false);
                }

                // Autenticación exitosa
                return done(null, user); // Devuelve el usuario relacionado
            } catch (error) {
                return done(error, false);
            }
        });
    }

    /**
     * Obtiene la IP del cliente desde el objeto `req`.
     */
    private getRequestIp(req: any): string {
        return (
            req.headers['x-forwarded-for'] || // IP detrás de un proxy (si aplica)
            req.connection?.remoteAddress || // IP directa
            req.socket?.remoteAddress || // IP desde el socket
            'unknown'
        );
    }
}
