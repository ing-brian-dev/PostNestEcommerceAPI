import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { UploadImageService } from '../upload-image/upload-image.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly uploadImageService: UploadImageService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!category) {
      let errors: string[] = [];
      errors.push('La categoría no existe.');
      throw new NotFoundException(errors);
    }

    return this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(categoryId: number | null, take: number, skip: number) {

    const options: FindManyOptions<Product> = {
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
      take, //Limit
      skip //Offset
    }

    if (categoryId) {
      options.where = {
        category: {
          id: categoryId
        }
      }
    }

    const [products, total] = await this.productRepository.findAndCount(options);

    return {
      products,
      total,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true
      }
    });

    if (!product) {
      throw new NotFoundException(`El producto: ${id} no fue encontrado.`)
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findBy({ id: updateProductDto.categoryId });
      if (!category) {
        let errors: string[] = [];
        errors.push('La categoría no existe.');
        throw new NotFoundException(errors);
      }
    }
    return await this.productRepository.save(product)
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.productRepository.softDelete(id);
    return { message: `Producto: ${id} eliminado.` };
  }

  async deleteImageByPublicId(publicId: string) {

    try {
      await this.uploadImageService.deleteFile(publicId);
    } catch (error) {
      throw new InternalServerErrorException(
        `No se pudo eliminar la imagen en Cloudinary error: ${error}`,
      );
    }
    
    const product = await this.productRepository.findOneBy({ image_public_id: publicId });
    if (!product) {
      throw new NotFoundException(`No se encontró un producto con la imagen: ${publicId}`);
    }

    product.image = null;
    product.image_public_id = null;
    await this.productRepository.save(product);
    return { message: `Imagen con publicId: ${publicId} eliminada del producto ${product.id}.` };
  }
}
