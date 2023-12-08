import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @Length(1500)
  description: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  items: number[];
}
