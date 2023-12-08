import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsUrl,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;
}
