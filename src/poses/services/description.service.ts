import { Injectable } from '@nestjs/common';
import { createPoseDto } from '../dtos/pose.dto';

@Injectable()
export class DescriptionService {
  createDescription(poseDto: createPoseDto): string {
    return `This description will be made by OpenAI`;
  }
}
