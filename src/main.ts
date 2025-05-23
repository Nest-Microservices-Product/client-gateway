import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/getEnvs';
import { RpcCustomExceptionFilter } from './shared/exceptions/rpcCustomException.filter';

async function bootstrap() {
  const logger = new Logger('Main-gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors()
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
  await app.listen(envs.port);
  logger.log(`Gateway started on port ${envs.port}`);
}
bootstrap();
