import { IsString, Length, IsOptional, IsNotEmpty } from 'class-validator';
export class createPoseDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly image: string;
}

export class updatePoseDto {
  @IsOptional()
  @IsString()
  @Length(3, 30)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;
}
