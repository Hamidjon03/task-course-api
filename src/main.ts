import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());
  
  // In main.ts
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth' // This name here is important for references
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Customize Swagger UI to automatically add Bearer prefix
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      authAction: {
        'JWT-auth': {
          name: 'JWT-auth',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'JWT token'
          },
          value: 'Bearer '
        }
      }
    },
  };
  
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'docs');
  SwaggerModule.setup(swaggerPath, app, document, customOptions);
  
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
