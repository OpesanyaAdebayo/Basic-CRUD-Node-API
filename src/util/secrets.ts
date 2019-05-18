import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export let MONGODB_URI: string;
export let TOKEN_SECRET: string | undefined;
export let NODEMAILER_CLIENT_ID: string | undefined;
export let NODEMAILER_CLIENT_SECRET: string | undefined;
export let NODEMAILER_USER_REFRESH_TOKEN: string | undefined;
export let NODEMAILER_USER: string;
export let REDIS_HOST: string;

export const loadSecrets = () => {
    MONGODB_URI = prod ? process.env.MONGODB_URI! : process.env.MONGODB_URI_LOCAL!;
    TOKEN_SECRET = process.env.TOKEN_SECRET;
    NODEMAILER_CLIENT_ID = process.env.NODEMAILER_CLIENT_ID;
    NODEMAILER_CLIENT_SECRET = process.env.NODEMAILER_CLIENT_SECRET;
    NODEMAILER_USER_REFRESH_TOKEN = process.env.NODEMAILER_USER_REFRESH_TOKEN;
    NODEMAILER_USER = process.env.NODEMAILER_USER!;
    REDIS_HOST = process.env.REDIS_HOST!;

    if (!MONGODB_URI) {
        logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
        process.exit(1);
    }
    if (!TOKEN_SECRET) {
        logger.error('No token signing string. Set TOKEN_SECRET environment variable.');
        process.exit(1);
    }
    if (!REDIS_HOST) {
        logger.error('No Redis URL. Set REDIS_URL environment variable.');
        process.exit(1);
    }
    if (!NODEMAILER_CLIENT_ID) {
        logger.error('No ClientID from Google. Set NODEMAILER_CLIENT_ID environment variable.');
        process.exit(1);
    }
    if (!NODEMAILER_CLIENT_SECRET) {
        logger.error('No Client Secret from Google. Set NODEMAILER_CLIENT_SECRET environment variable.');
        process.exit(1);
    }
    if (!NODEMAILER_USER_REFRESH_TOKEN) {
        logger.error('No User Refresh Token from Google. Set NODEMAILER_USER_REFRESH_TOKEN environment variable.');
        process.exit(1);
    }
    if (!NODEMAILER_USER) {
        logger.error('No User Email. Set NODEMAILER_USER environment variable.');
        process.exit(1);
    }

};

loadSecrets();
