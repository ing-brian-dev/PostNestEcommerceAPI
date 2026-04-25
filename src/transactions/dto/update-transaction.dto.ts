import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateTransactionDto, TransactionContentsDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsArray()
  @ArrayNotEmpty({ message: 'Los contenidos no pueden ir vacíos' })
  @ValidateNested({ each: true })
  @Type(() => TransactionContentsDto)
  declare contents: TransactionContentsDto[];
}