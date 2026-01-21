export interface QueueService {
  enqueueEmailJob(emailJobId: string, scheduledAt: Date): Promise<void>;
}