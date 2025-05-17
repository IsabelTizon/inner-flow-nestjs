import { IsString, Length, IsOptional } from 'class-validator';
export class createPoseDto {
  @IsString()
  @Length(3, 30)
  readonly name: string;

  @IsString()
  readonly description: string;

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
