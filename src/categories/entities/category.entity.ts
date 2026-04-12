import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

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
}
