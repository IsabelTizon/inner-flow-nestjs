import {
  IsString,
  Length,
  IsArray,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateSequenceDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsArray()
  @IsUUID('4', { each: true })
  poses: string[];

  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateSequenceDto {
  @IsOptional()
  @IsString()
  @Length(3, 30)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  poses?: string[];

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class ShareSequenceDto {
  @IsBoolean()
  isPublic: boolean;
}
