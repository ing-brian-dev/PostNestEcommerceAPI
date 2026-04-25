import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ // You need to add `npm i --save class-validator` and `class-transformer`
    whitelist: true // This configuration filters only the names that are in the DTO as a mapping and excludes those that have not been declared.
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
