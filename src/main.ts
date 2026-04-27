import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // This configuration allows you to use the Express adapter, which provides additional features such as serving static files and using middleware.
  app.useGlobalPipes(new ValidationPipe({ // You need to add `npm i --save class-validator` and `class-transformer`
    whitelist: true // This configuration filters only the names that are in the DTO as a mapping and excludes those that have not been declared.
  }));
  app.useStaticAssets(join(__dirname, '../public')); // This configuration allows you to serve static files from the 'public' directory. You can access them via http://localhost:3000/filename.ext
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
