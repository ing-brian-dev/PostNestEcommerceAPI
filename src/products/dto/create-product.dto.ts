import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty({ message: 'El nombre es requerido.' })
    @IsString({ message: 'El nombre no es válido.' })
    declare name: string;

    @IsNotEmpty({ message: 'El precio es requerido.' })
    @IsNumber({ maxDecimalPlaces: 2 }, {message : 'El precio solo debe tener 2 decimales.'})
    declare price: number;

    @IsNotEmpty({ message: 'El inventario es requerido.' })
    @IsInt({ message: 'El valor del inventario debe ser un número entero.' })
    declare inventory: number;

    @IsNotEmpty({ message: 'La categoria es requerida.' })
    @IsInt({ message: 'La categoria debe ser un número entero.' })
    declare categoryId: number;
}
