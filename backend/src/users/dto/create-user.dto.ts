import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;
}
