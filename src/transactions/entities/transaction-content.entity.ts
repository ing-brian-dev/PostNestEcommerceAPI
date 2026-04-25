import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { Transaction } from "./transaction.entity";

@Entity()
export class TransactionContents {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column('int')
    declare quantity: number;

    @Column('decimal')
    declare price: number;



    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @DeleteDateColumn()
    declare deletedAt?: Date;



    @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true })
    declare product: Product;

    @ManyToOne(() => Transaction, (transaction) => transaction.contents, { cascade: true })
    declare transaction: Transaction;
}
