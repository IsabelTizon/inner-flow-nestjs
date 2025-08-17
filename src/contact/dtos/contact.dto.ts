import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsEmail()
  to: string;
}
