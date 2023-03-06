import { EMAIL_PASSWORD, EMAIL_USER } from '@/config';
import { logger } from '@/utils/logger';
import { replaceAll } from '@/utils/util';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, `../../files/private/email/verify.html`));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});
class EmailService {
  public sendVerifyEmail(to: string, redirectUrl: string): Promise<boolean> {
    const subject = 'Verify your email';
    const formatHtml = replaceAll(html.toString(), '$REDIRECT_URL$', redirectUrl);
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: subject,
        html: formatHtml,
      };
      transporter.sendMail(mailOptions, (err: Error) => {
        if (err) {
          logger.error(`Send email fail to ${to}: ${JSON.stringify(err)}`);
          reject(err);
        } else {
          logger.info(`Send email to [${to}] successful`);
          resolve(true);
        }
      });
    });
  }
}
export default EmailService;
