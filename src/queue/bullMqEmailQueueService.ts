import { Queue } from 'bullmq';
import { createRedisConnection } from './queue.connection';
import { QueueService } from './queue.service';
import { EmailJobPayload } from './queue.types';

export class BullMQEmailQueueService implements QueueService {
  private queue: Queue<EmailJobPayload>;

  constructor() {
    this.queue = new Queue<EmailJobPayload>('email-jobs', {
      connection: createRedisConnection(),
    });
  }

  async enqueueEmailJob(emailJobId: string, scheduledAt: Date): Promise<void> {
    const delay = scheduledAt.getTime() - Date.now();
    
    await this.queue.add(
      'send-email',
      { emailJobId },
      {
        jobId: emailJobId,
        delay: Math.max(0, delay),
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      }
    );
  }
}