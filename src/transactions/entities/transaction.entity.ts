import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column('decimal')
    declare total: number;

    

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @DeleteDateColumn()
    declare deletedAt?: Date;

}
