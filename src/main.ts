import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ // se necesita agregar npm i --save class-validator y class-transformer
    whitelist: true //Esta configuracion filtra solo los nombres que esten en el DTO como un mapeo y expulsa los que no an sido declarados
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
