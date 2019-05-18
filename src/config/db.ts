import mongoose from 'mongoose';
import logger from '../util/logger';
import { MONGODB_URI } from '../util/secrets';

const MONGO_CONFIG = {
  connectTimeoutMS: 30000,
  keepAlive: true,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
};

export const db = mongoose.createConnection(MONGODB_URI, MONGO_CONFIG);

db.then(() => logger.info('Database connected'))
  .catch((err: Error) => logger.error(JSON.stringify(err)));
