import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
    @IsNotEmpty({
        message: "El nombre es requerido."
    })
    declare name: string;
}
