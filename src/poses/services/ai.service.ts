import { Injectable } from '@nestjs/common'; // it is a decorator used to mark a class as a provider, in this case, for the AI service to interact with OpenAI API
import axios from 'axios'; // axios for making HTTP requests to the OpenAI API

@Injectable()
export class AIService {
  async ask(prompt: string): Promise<string> {
    console.log(
      'API Key starts with:',
      process.env.OPENAI_API_KEY?.substring(0, 20),
    ); // verifying the API key starts with 'sk-'
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
        // model: 'gpt-4-turbo',
        model: 'gpt-4o-mini',
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
