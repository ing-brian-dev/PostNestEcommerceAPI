import { IsNotEmpty } from "class-validator";


export class ApplyCouponDto {
    @IsNotEmpty({
        message: 'El nombre es requerido.'
    })
    declare coupon_name : string;
}