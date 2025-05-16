import { IsString } from 'class-validator';
export class addPoseDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;
}
