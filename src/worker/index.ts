import { Worker } from 'bullmq';
import { AppDataSource } from '../db/data-source';
import { createRedisConnection } from '../queue/queue.connection';
import { EmailDispatchService } from '../services/EmailDispatchService';
import { EmailJobRepository } from '../repositories/EmailJobRepository';
import { NodemailerEtherealProvider } from '../providers/nodemailerEthereal.provider';
import { createEmailJobProcessor } from './processor';
import { logger } from '../logger';

async function startWorker() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected');

    const jobRepo = new EmailJobRepository();
    const emailProvider = new NodemailerEtherealProvider();
    const dispatchService = new EmailDispatchService(jobRepo, emailProvider);
    
    const processor = createEmailJobProcessor(dispatchService);

    const worker = new Worker('email-jobs', processor, {
      connection: createRedisConnection(),
      concurrency: 10,
    });

    worker.on('completed', (job) => {
      logger.info({ jobId: job.id }, 'Job completed');
    });

    worker.on('failed', (job, err) => {
      logger.error({ jobId: job?.id, error: err.message }, 'Job failed');
    });

    logger.info('Worker started successfully');
  } catch (error) {
    logger.error({ error }, 'Worker failed to start');
    process.exit(1);
  }
}

startWorker();