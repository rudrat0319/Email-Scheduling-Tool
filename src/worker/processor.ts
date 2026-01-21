import { Job } from 'bullmq';
import { EmailJobPayload } from '../queue/queue.types';
import { EmailDispatchService } from '../services/EmailDispatchService';
import { logger } from '../logger';

export const createEmailJobProcessor = (dispatchService: EmailDispatchService) => {
  return async (job: Job<EmailJobPayload>) => {
    logger.info({ jobId: job.id, emailJobId: job.data.emailJobId }, 'Processing email job');
    
    await dispatchService.dispatchEmail(job.data.emailJobId);
    
    logger.info({ jobId: job.id, emailJobId: job.data.emailJobId }, 'Email job completed');
  };
};