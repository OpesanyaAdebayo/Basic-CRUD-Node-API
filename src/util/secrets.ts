import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const ENVIRONMENT = process.env.NODE_ENV;

export const MONGODB_URI = throwIfUndefined(
  process.env.MONGODB_URI,
  'MONGODB_URI'
);
export const TOKEN_SECRET = throwIfUndefined(
  process.env.TOKEN_SECRET,
  'TOKEN_SECRET'
);
export const NODEMAILER_CLIENT_ID = throwIfUndefined(
  process.env.NODEMAILER_CLIENT_ID,
  'NODEMAILER_CLIENT_ID'
);
export const NODEMAILER_CLIENT_SECRET = throwIfUndefined(
  process.env.NODEMAILER_CLIENT_SECRET,
  'NODEMAILER_CLIENT_SECRET'
);
export const NODEMAILER_USER_REFRESH_TOKEN = throwIfUndefined(
  process.env.NODEMAILER_USER_REFRESH_TOKEN,
  'NODEMAILER_USER_REFRESH_TOKEN'
);
export const NODEMAILER_USER = throwIfUndefined(
  process.env.NODEMAILER_USER,
  'NODEMAILER_USER'
);
export const REDIS_HOST = throwIfUndefined(
  process.env.REDIS_HOST,
  'REDIS_HOST'
);
export const RESET_PASSWORD_LINK = throwIfUndefined(
  process.env.RESET_PASSWORD_LINK,
  'RESET_PASSWORD_LINK'
);

function throwIfUndefined<T> (secret: T | undefined, name?: string): T {
  if (!secret) {
    logger.error(`${name} must not be undefined`);
    return process.exit(1);
  }
  return secret;
}
