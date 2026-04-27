import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../categories/entities/category.entity";
import { Repository } from "typeorm";
import { Product } from "../products/entities/product.entity";
import { categories } from "./data/categories";
import { products } from "./data/products";
import { DataSource } from "typeorm";

@Injectable()
export class SeederService {

    constructor(
        @InjectRepository(Category) private readonly categoryRespository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private dataSource: DataSource
    ) { }

    async onModuleInit(){
        const connection = this.dataSource;
        await connection.dropDatabase();
        await connection.synchronize();
    }

    async seed() {
        await this.categoryRespository.save(categories);
        for await (const seedProduct of products) {
            const category = await this.categoryRespository.findOneBy({id: seedProduct.categoryId});
            const product = new Product();
            product.name = seedProduct.name;
            product.image = seedProduct.image;
            product.price = seedProduct.price;
            product.inventory = seedProduct.inventory;
            product.category = category!;

            await this.productRepository.save(product);
        }
    }
}