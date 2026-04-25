import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionContents } from './entities/transaction-content.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction,TransactionContents,Product])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
