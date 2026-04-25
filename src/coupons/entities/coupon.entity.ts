import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupon {

    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        type: 'varchar',
        length: 30
    })
    declare name: string;


    @Column({
        type: 'integer'
    })
    declare percentage: number;


    @Column({
        type: 'date'
    })
    declare expirationDate: Date;
}
