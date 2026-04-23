import { IsNumberString, IsOptional } from "class-validator";


export class GetProductsQueryDto {

    @IsOptional()
    @IsNumberString({}, { message: 'La categoria debe ser numerica' })
    declare category_id?: number;

    @IsOptional()
    @IsNumberString({}, { message: 'La cantidad debe ser numerica' })
    declare take?: number

    @IsOptional()
    @IsNumberString({}, { message: 'La cantidad debe ser numerica' })
    declare per_page?: number
}