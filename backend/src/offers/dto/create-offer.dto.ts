import { IsNotEmpty, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  @IsNotEmpty()
  item: number;
}
