import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
async function bootstrap() {
  const uuid = uuidv4();
  const logger = new Logger('wallet-api-logger');

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(envs.apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NESTJS WALLET API')
    .setDescription('The NESTJS WALLET API description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(uuid, app, document);

  const port = process.env.PORT || 8080;
  await app.listen(port,'0.0.0.0');
  logger.log(`Aplicación corriendo en: ${port}`);
  logger.log(`Documentacion corriendo en: /${uuid}`);
  logger.log(`Aplicacion corriendo en: ${envs.apiPrefix}`);
}
bootstrap();
