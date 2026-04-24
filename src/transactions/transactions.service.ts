import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionContents } from './entities/transaction-content.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRespository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRespository: Repository<Product>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {

    await this.productRespository.manager.transaction(async (transactionEntityManager) => {
      const transaction = new Transaction();
      transaction.total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0);
      await transactionEntityManager.save(transaction);

      const errors : string[] = [];

      for (const contents of createTransactionDto.contents) {

        const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId });
        if (!product) {
          errors.push(`Producto con id ${contents.productId} no encontrado`);
          throw new NotFoundException(errors);
        }

        if (contents.quantity > product.inventory) {
          errors.push(`El articulo ${product.name} excede la cantidad disponible.`);
          throw new BadRequestException(errors)
        }
        // Decrese inventory
        product.inventory -= contents.quantity;

        //Create transactionContents instance
        const transactionContent = new TransactionContents();
        transactionContent.price = contents.price;
        transactionContent.product = product;
        transactionContent.quantity = contents.quantity;
        transactionContent.transaction = transaction;

        await transactionEntityManager.save(transaction);
        await transactionEntityManager.save(transactionContent);
      }
    })


    return 'Venta almacenada correctamente.';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
