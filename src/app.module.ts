import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],//traerme funcionalidad de servicios
  // exports: [AppService]// Exportar funcionalidad a otros servicios
})
export class AppModule {}
