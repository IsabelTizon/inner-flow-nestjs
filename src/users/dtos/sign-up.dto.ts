import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  passwordHash: string;
}
