import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Product } from "../../products/entities/product.entity";

//To use Active Record you must have to extends from BaseEntity
//Data Maper is the Default
@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        type: 'varchar',
        length: 60
    })
    declare name: string;

    @CreateDateColumn()
    declare created: Date;

    @UpdateDateColumn()
    declare updated: Date;

    // Add this column to your entity!
    @DeleteDateColumn()
    declare deletedAt?: Date;

    @OneToMany(() => Product, (product) => product.category, { cascade: true })
    declare products: Product[];
}
