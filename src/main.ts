import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);
  
  app.enableCors();
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE', 'Task Course API'))
    .setDescription(configService.get<string>('SWAGGER_DESCRIPTION', 'Task Course API documentation'))
    .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0'))
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'docs');
  SwaggerModule.setup(swaggerPath, app, document);
  
  const port = configService.get<number>('PORT', 3000);
  
  await app.listen(port);
  
  const serverUrl = `http://localhost:${port}`;
  logger.log(`🚀 Application is running on: ${serverUrl}`);
  logger.log(`🔌 API endpoints available at: ${serverUrl}/${apiPrefix}`);
  console.log(`📝 Swagger documentation available at: ${serverUrl}/${swaggerPath}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error(`Application startup failed: ${err.message}`);
});
