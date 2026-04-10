import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [AppController],
  providers: [AppService],//traerme funcionalidad de servicios
  // exports: [AppService]// Exportar funcionalidad a otros servicios
})
export class AppModule {}
