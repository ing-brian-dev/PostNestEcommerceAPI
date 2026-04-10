import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({
        message: "El nombre es requerido."
    })
    declare name: string;
}
