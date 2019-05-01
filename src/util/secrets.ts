import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const MONGODB_URI = prod ? process.env.MONGODB_URI! : process.env.MONGODB_URI_LOCAL!;
export const TOKEN_SECRET = process.env.TOKEN_SECRET!;

if (!MONGODB_URI) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    process.exit(1);
}

if (!TOKEN_SECRET) {
    logger.error('No token signing string. Set TOKEN_SECRET environment variable.');
    process.exit(1);
}
