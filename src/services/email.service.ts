import { EMAIL_PASSWORD, EMAIL_USER } from '@/config';
import { logger } from '@/utils/logger';
import { replaceAll } from '@/utils/util';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';

const verifyHtml = fs.readFileSync(path.resolve(__dirname, `../../files/private/email/verify.html`));
const forgotHtml = fs.readFileSync(path.resolve(__dirname, `../../files/private/email/forgot.html`));

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
  private sendEmailWithHtmlTemplate = (to: string, subject: string, html: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
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
  };

  public sendVerifyEmail(to: string, redirectUrl: string): Promise<boolean> {
    const subject = 'Verify your email';
    const formatHtml = replaceAll(verifyHtml.toString(), '$REDIRECT_URL$', redirectUrl);
    return new Promise((resolve, reject) => {
      this.sendEmailWithHtmlTemplate(to, subject, formatHtml)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public sendResetPassword(to: string, redirectUrl: string): Promise<boolean> {
    const subject = 'Reset Password';
    const replaceAccount = replaceAll(forgotHtml.toString(), '$ACCOUNT$', to);
    const replapceURL = replaceAll(replaceAccount, '$FORGOT_URL$', redirectUrl);

    return new Promise((resolve, reject) => {
      this.sendEmailWithHtmlTemplate(to, subject, replapceURL)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          console.log(err);

          reject(err);
        });
    });
  }
}
export default EmailService;
