import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/getEnvs';
import { RpcCustomExceptionFilter } from './shared/exceptions/rpcCustomException.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main-gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  //config for validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //config for filter
  app.useGlobalFilters(
    //filter for errors
    new RpcCustomExceptionFilter(),
  );
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Client Gateway API')
    .setDescription('API documentation for the Client Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(envs.port);
  logger.log(`Gateway started on port ${envs.port} :D`);
}
bootstrap();
