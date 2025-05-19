import { IsString, Length, IsArray, IsUUID, IsOptional } from 'class-validator';

export class CreateSequenceDto {
  @IsString()
  @Length(3, 30)
  readonly name: string;

  @IsArray()
  @IsUUID('4', { each: true })
  readonly poses: string[];
  @IsString()
  @IsUUID()
  readonly userId: string;
}

export class UpdateSequenceDto {
  @IsOptional()
  @IsString()
  @Length(3, 30)
  readonly name?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly poses?: string[];

  @IsOptional()
  @IsUUID()
  readonly userId?: string;
}
