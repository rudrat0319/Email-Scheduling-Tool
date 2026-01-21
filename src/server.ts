import { AppDataSource } from './db/data-source';
import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';

async function startServer() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected');

    const app = createApp();
    const port = parseInt(config.PORT, 10);

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();