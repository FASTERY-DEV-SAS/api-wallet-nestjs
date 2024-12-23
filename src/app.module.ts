import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransfersModule } from './transfers/transfers.module';
import { CategoriesModule } from './categories/categories.module';
import { envs } from './config';
import { AnalyticsModule } from './analytics/analytics.module';
import { DataManagementModule } from './data-management/data-management.module';
// import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: envs.sta === 'prod',
      extra: {
        ssl: envs.sta === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      database: envs.dbName,
      username: envs.dbUser,
      password: envs.dbPass,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    AuthModule,
    WalletsModule,
    TransfersModule,
    CategoriesModule,
    AnalyticsModule,
    DataManagementModule,
    // FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
