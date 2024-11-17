import { Module } from '@nestjs/common';
import { DataManagementService } from './data-management.service';
import { DataManagementController } from './data-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/config';
import { Cedula } from './entities/cedula.entity';
import { Ruc } from './entities/ruc.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'data-management',
      ssl: envs.sta === 'prod',
      extra: {
        ssl: envs.sta === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: envs.dbHostDataManagement,
      port: envs.dbPortDataManagement,
      database: envs.dbNameDataManagement,
      username: envs.dbUserDataManagement,
      password: envs.dbPassDataManagement,
      autoLoadEntities: true,
      synchronize: true,
      entities: [Cedula, Ruc],
    }),
    TypeOrmModule.forFeature([Cedula, Ruc], 'data-management'),
    HttpModule
  ],
  controllers: [DataManagementController],
  providers: [DataManagementService],
})
export class DataManagementModule { }
