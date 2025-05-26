import { Injectable } from '@nestjs/common';
import { createPoseDto } from '../dtos/pose.dto';
import axios from 'axios';

@Injectable()
export class DescriptionService {
  async createDescription(poseDto: createPoseDto): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: `Create a pose's description of ${poseDto.name}`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        },
      },
    );

    console.log(response.data);
    return response.data;
    // return response.data.choices[0].message.content;
  }
}
//
