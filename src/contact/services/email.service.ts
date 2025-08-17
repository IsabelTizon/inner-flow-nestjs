import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactDto } from '../dtos/contact.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    const emailService = process.env.EMAIL_SERVICE;
    console.log('Creating email transporter with service:', emailService);

    // Gmail configuration
    if (emailService === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    // Outlook/Hotmail configuration
    if (emailService === 'hotmail') {
      return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    if (emailService === 'sendgrid') {
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    // Custom SMTP configuration
    if (process.env.EMAIL_HOST) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    // Default: Ethereal Email for development/testing
    console.log(
      'Using Ethereal Email for development. Set EMAIL_SERVICE environment variable for production.',
    );

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
    });
  }

  async sendContactMessage(contactData: ContactDto): Promise<void> {
    if (
      process.env.EMAIL_SERVICE === 'ethereal' ||
      !process.env.EMAIL_SERVICE
    ) {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Created Ethereal test account:', testAccount.user);
    }

    const { name, surname, email, message, to } = contactData;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${name} ${surname}" <${email}>`,
      to: to,
      subject: `Contact Form Message from ${name} ${surname}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name} ${surname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name} ${surname}
        Email: ${email}
        Message: ${message}
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('Message sent:', info.messageId || 'No message ID');

      if (process.env.NODE_ENV !== 'production') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const previewUrl = nodemailer.getTestMessageUrl(info);
          if (previewUrl) {
            console.log('Preview URL:', previewUrl);
          }
        } catch {
          console.log('Could not generate preview URL');
        }
      }
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      console.error('Email service config:', process.env.EMAIL_SERVICE);
      console.error('Environment variables loaded:', {
        EMAIL_SERVICE: process.env.EMAIL_SERVICE,
        EMAIL_USER: process.env.EMAIL_USER ? '***SET***' : 'NOT SET',
        EMAIL_PASS: process.env.EMAIL_PASS ? '***SET***' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
      });
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
}
