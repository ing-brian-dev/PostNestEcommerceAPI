import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {

    @IsNotEmpty({
        message: 'El nombre es requerido.'
    })
    declare name: string;

    @IsNotEmpty({
        message: 'El porcentaje es requerido.'
    })
    @IsInt({
        message: 'El descuento debe der entre 1 y 100.'
    })
    @Max(100, {
        message: 'El descuento maximo es de 100.'
    })
    @Min(1, {
        message: 'El descuento minimo es de 1.'
    })
    declare percentage: number;

    @IsNotEmpty({
        message: 'La fecha es requerida.'
    })
    @IsDateString({}, {
        message: 'Fecha no válida.'
    })
    declare expirationDate: Date;
}
