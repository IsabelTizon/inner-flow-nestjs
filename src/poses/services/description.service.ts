import { Injectable } from '@nestjs/common'; // it is a decorator used to mark a class as a provider, in this case, for the AI service to interact with OpenAI API
import { AIService } from './ai.service'; //
import { createPoseDto } from '../dtos/pose.dto'; // dto for creating poses descriptions

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
