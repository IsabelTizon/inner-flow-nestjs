// NestJS decorators to handle HTTP requests.
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

// DTO
import { ContactDto } from './dtos/contact.dto';

// SERVICE
import { EmailService } from './services/email.service';

@Controller('contact') //controller handle requests sent to the /contact route.
export class ContactController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendContactMessage(
    //sendContactMessage: sets the response code to 200 OK if the request succeeds.
    @Body() contactData: ContactDto,
  ): Promise<{ message: string }> {
    try {
      await this.emailService.sendContactMessage(contactData);
      return { message: 'Contact message sent successfully' };
    } catch (error) {
      console.error('Error processing contact form:', error);
      throw new Error('Failed to send contact message');
    }
  }
}
