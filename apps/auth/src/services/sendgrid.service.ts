import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    const msg = {
      to,
      from: 'dextere2512@gmail.com',
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      return 'Email sent successfully';
    } catch (error) {
      throw new Error('Error sending email: ' + error.message);
    }
  }
}
