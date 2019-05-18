import fs from 'fs';
import nunjucks from 'nunjucks';
import path from 'path';
import { transporter } from '../../config/nodemailer';

export const generateNoEmailForPasswordReset = () => {
  nunjucks.configure({ autoescape: true });
  return nunjucks.renderString(
    fs.readFileSync(path.join(__dirname, '/templates/noEmailForPasswordReset.html')).toString('utf-8'),
    { }
  );
};

export const generateEmailForPasswordReset = (link: string) => {
  nunjucks.configure({ autoescape: true });
  return nunjucks.renderString(
    fs.readFileSync(path.join(__dirname, '/templates/emailForPasswordReset.html')).toString('utf-8'),
    {
      link
    }
  );
};

export interface IMailDetails {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = async ( mailContent: IMailDetails) => {
  try {
    await transporter.sendMail(mailContent);
  } catch (error) {
    throw error;
  }
};
