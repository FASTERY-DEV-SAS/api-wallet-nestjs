import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { envs } from 'src/config';
import { ApiKeyStrategy } from './strategies/apikey.strategy';
import { ApiKey } from './entities/apikey.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User,ApiKey]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: envs.jwtSecret,
          signOptions: { expiresIn: '12h' },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, ApiKeyStrategy, PassportModule, JwtModule],
})
export class AuthModule { }
