import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailjet from 'node-mailjet';

@Injectable()
export class SendGridService {
  private mailjetClient;

  constructor(private readonly configService: ConfigService) {
    this.mailjetClient = mailjet.Client.apiConnect(
      this.configService.get<string>('MAILJET_API_KEY'),
      this.configService.get<string>('MAILJET_API_SECRET'),
    );
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    const request = this.mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'dextere2512@gmail.com',
            Name: 'Auction Hub',
          },
          To: [
            {
              Email: to,
              Name: to,
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        },
      ],
    });

    try {
      const response = await request;
      console.log('Email response: ', response.body);
      return 'Email sent successfully.';
    } catch (err) {
      console.error('Email error: ', err.statusCode);
      return 'Sending email failure.';
    }
  }
}
