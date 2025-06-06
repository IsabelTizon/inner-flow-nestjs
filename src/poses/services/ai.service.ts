import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AIService {
  async ask(prompt: string): Promise<string> {
    interface OpenAIResponse {
      choices: {
        message: {
          content: string;
        };
      }[];
    }

    const response = await axios.post<OpenAIResponse>(
      //url
      'https://api.openai.com/v1/chat/completions',
      // data,
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      //
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  }
}
