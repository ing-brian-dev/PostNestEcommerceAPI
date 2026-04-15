import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        type: 'varchar',
        length: 60
    })
    declare name: string;

    @Column({
        type: 'varchar',
        length: 120,
        nullable: true,
        default: 'default.sgv'
    })
    declare image: number;

    @Column({
        type: 'decimal'
    })
    declare price: number;

    @Column({
        type: 'int'
    })
    declare inventory: number;

    @CreateDateColumn()
    declare created: Date;

    @UpdateDateColumn()
    declare updated: Date;

    // Add this column to your entity!
    @DeleteDateColumn()
    declare deletedAt?: Date;
}
