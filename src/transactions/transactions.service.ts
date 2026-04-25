import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { TransactionContents } from './entities/transaction-content.entity';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

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
      transaction.total = createTransactionDto.contents.reduce(
        (total, item) => total + (item.quantity * item.price), 0
      );
      await transactionEntityManager.save(transaction);

      for (const contents of createTransactionDto.contents) {

        const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId });

        if (!product) {
          throw new NotFoundException(`Producto con id ${contents.productId} no encontrado`);
        }

        if (contents.quantity > product.inventory) {
          throw new BadRequestException(`El artículo ${product.name} excede la cantidad disponible.`);
        }

        // Descontar inventario
        product.inventory -= contents.quantity;
        await transactionEntityManager.save(product);

        // Crear instancia de TransactionContents
        const transactionContent = new TransactionContents();
        transactionContent.price = contents.price;
        transactionContent.product = product;
        transactionContent.quantity = contents.quantity;
        transactionContent.transaction = transaction;

        await transactionEntityManager.save(transactionContent);
      }
    });

    return 'Venta almacenada correctamente.';
  }

  findAll(createdAt?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }
    if (createdAt) {
      const date = parseISO(createdAt);
      if (!isValid(date)) {
        throw new BadRequestException('Fecha no válida');
      }

      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        createdAt: Between(start, end)
      }

    }

    return this.transactionRespository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRespository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada.')
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    await this.transactionRespository.manager.transaction(async (transactionManagerEntity) => {

      const transaction = await transactionManagerEntity.findOne(Transaction, {
        where: { id },
        relations: { contents: { product: true } },
      });

      if (!transaction) throw new NotFoundException('Transacción no encontrada.');

      const incomingContents = updateTransactionDto.contents;
      const existingContents = transaction.contents;

      for (let i = 0; i < incomingContents.length; i++) {
        const item = incomingContents[i];
        const existing = existingContents[i];

        if (existing) {
          const isSameProduct = existing.product.id === item.productId;

          if (isSameProduct) {
            const diff = item.quantity - existing.quantity;

            if (diff > 0 && diff > existing.product.inventory) {
              throw new BadRequestException(
                `El artículo "${existing.product.name}" excede la cantidad disponible en inventario.`,
              );
            }

            existing.product.inventory -= diff;
            await transactionManagerEntity.save(Product, existing.product);

          } else {
            existing.product.inventory += existing.quantity;
            await transactionManagerEntity.save(Product, existing.product);

            const newProduct = await transactionManagerEntity.findOne(Product, {
              where: { id: item.productId },
            });

            if (!newProduct) {
              throw new NotFoundException(`Producto con id ${item.productId} no encontrado.`);
            }

            if (item.quantity > newProduct.inventory) {
              throw new BadRequestException(
                `El artículo "${newProduct.name}" excede la cantidad disponible en inventario.`,
              );
            }

            newProduct.inventory -= item.quantity;
            await transactionManagerEntity.save(Product, newProduct);
            existing.product = newProduct;
          }

          await transactionManagerEntity.update(TransactionContents, existing.id, {
            quantity: item.quantity,
            price: item.price,
            product: { id: existing.product.id },
          });

        } else {
          const product = await transactionManagerEntity.findOne(Product, {
            where: { id: item.productId },
          });

          if (!product) {
            throw new NotFoundException(`Producto con id ${item.productId} no encontrado.`);
          }

          if (item.quantity > product.inventory) {
            throw new BadRequestException(
              `El artículo "${product.name}" excede la cantidad disponible en inventario.`,
            );
          }

          product.inventory -= item.quantity;
          await transactionManagerEntity.save(Product, product);

          await transactionManagerEntity.insert(TransactionContents, {
            quantity: item.quantity,
            price: item.price,
            product: { id: product.id },
            transaction: { id: transaction.id },
          });
        }
      }

      if (existingContents.length > incomingContents.length) {
        const surplus = existingContents.slice(incomingContents.length);

        for (const content of surplus) {
          content.product.inventory += content.quantity;
          await transactionManagerEntity.save(Product, content.product);

          await transactionManagerEntity.delete(TransactionContents, content.id);
        }
      }

      const newTotal = incomingContents.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      );

      await transactionManagerEntity.update(Transaction, id, { total: newTotal });
    });

    return { message: 'Venta actualizada correctamente.' };
  }

  async remove(id: number) {
    const transaction = await this.transactionRespository.findOne({
      where: { id },
      relations: { contents: { product: true } }
    });
    if (!transaction) throw new NotFoundException('Transacción no encontrada.');

    for (const content of transaction.contents) {
      content.product.inventory += content.quantity;
      await this.productRespository.save(content.product);
      await this.transactionContentsRepository.softDelete(content.id);
    }

    await this.transactionRespository.softDelete(id);
    return { message: 'Venta eliminada correctamente.' };
  }
}
