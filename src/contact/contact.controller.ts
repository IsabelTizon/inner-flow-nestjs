import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactDto } from './dtos/contact.dto';
import { EmailService } from './services/email.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendContactMessage(
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
