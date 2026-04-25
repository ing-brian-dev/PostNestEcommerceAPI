import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionContents } from "./transaction-content.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column('decimal')
    declare total: number;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: true
    })
    declare coupon: number;

    @Column({
        type: 'decimal',
        nullable: true
    })
    declare discount: number;



    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @DeleteDateColumn()
    declare deletedAt?: Date;



    @OneToMany(() => TransactionContents, (transaction) => transaction.transaction)
    declare contents: TransactionContents[];
}
