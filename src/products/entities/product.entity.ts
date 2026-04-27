import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";

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
        default: 'default.svg'
    })
    declare image: string;

    @Column({
        type: 'decimal'
    })
    declare price: number;

    @Column({
        type: 'int'
    })
    declare inventory: number;


    
    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    @DeleteDateColumn()
    declare deletedAt?: Date;

    @ManyToOne(() => Category)
    declare category: Category;
}
