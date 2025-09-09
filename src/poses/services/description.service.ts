import { Injectable } from '@nestjs/common';
import { AIService } from './ai.service';
import { createPoseDto } from '../dtos/pose.dto';

@Injectable()
export class DescriptionService {
  constructor(private readonly aiService: AIService) {}

  async createDescription(poseDto: createPoseDto): Promise<string> {
    const response = await this.aiService.ask(
      `Give me the description of ${poseDto.name} in yoga.`,
    );

    return response;
  }
}
//
