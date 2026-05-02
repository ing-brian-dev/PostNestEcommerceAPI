import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category
    ]),
    UploadImageModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
