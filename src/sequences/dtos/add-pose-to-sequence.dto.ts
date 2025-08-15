// DATA VALIDATION LIBRARY
import { IsUUID } from 'class-validator';

export class AddPoseToSequenceDto {
  @IsUUID()
  poseId: string;
}
