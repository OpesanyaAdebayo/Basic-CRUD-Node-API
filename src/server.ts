import app from './index';
import logger from './util/logger';

const server = app.listen(process.env.PORT, () => {
  logger.info(`App is running at ${process.env.PORT}`);
  }
);

export default server;
