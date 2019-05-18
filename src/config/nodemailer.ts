import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  auth: {
    accessToken: process.env.NODEMAILER_ACCESS_TOKEN,
    clientId: process.env.NODEMAILER_CLIENT_ID,
    clientSecret: process.env.NODEMAILER_CLIENT_SECRET,
    expires: 1484314697598,
    refreshToken: process.env.NODEMAILER_USER_REFRESH_TOKEN,
    type: 'OAuth2',
    user: process.env.NODEMAILER_USER,
  },
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
});

export { transporter };
