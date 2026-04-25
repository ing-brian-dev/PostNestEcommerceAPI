import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {

  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
  ) { }

  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto);
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({ id });

    if (!coupon) {
      throw new NotFoundException(`El cupon con el Id: ${id} no fue encontrado.`)
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto);
    return await this.couponRepository.save(coupon);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.couponRepository.softDelete(id);
    return { message: 'Cupon eliminado' };
  }

  async applyCoupon(applyCouponDto: ApplyCouponDto) {
    const coupon = await this.couponRepository.findOneBy({ name: applyCouponDto.coupon_name });

    if (!coupon) {
      throw new NotFoundException('Cupon no encontrado.');
    }
    const currentDate = new Date();
    const expirationDate = endOfDay(coupon.expirationDate);

    if (isAfter(currentDate, expirationDate)) {
      throw new UnprocessableEntityException('Cupon ya expirado.');
    }

    return {
      message: 'Cupón válido',
      ...coupon
    };
  }
}
