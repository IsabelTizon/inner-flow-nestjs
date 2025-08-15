// DATA VALIDATION LIBRARY
import { IsString, IsOptional } from 'class-validator';

export class CreateSequenceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
