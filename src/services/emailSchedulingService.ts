import { EmailBatchRepository } from '../repositories/emailBatchRepository';
import { EmailJobRepository } from '../repositories/emailJobRepository';
import { SenderRepository } from '../repositories/senderRepository';
import { SchedulingEngine } from './schedulingEngine';
import { QueueService } from '../queue/queueService';
import { createEmailResponseDto } from '../dtos/email/createEmailResponseDto';
import { CreateEmailBatchRequest } from '../dtos/email/createEmailBatchRequestDto';
import { validationError } from '../errors/validationError';
import { SCHEDULING } from '../config/constants';

export class EmailSchedulingService {
  constructor(
    private batchRepo: EmailBatchRepository,
    private jobRepo: EmailJobRepository,
    private senderRepo: SenderRepository,
    private schedulingEngine: SchedulingEngine,
    private queueService: QueueService
  ) {}

  async scheduleEmailBatch(
    userId: string,
    data: CreateEmailBatchRequest & { startTime: Date }
  ): Promise<createEmailResponseDto> {
    const sender = await this.senderRepo.findByIdAndUserId(data.senderId, userId);
    if (!sender) throw new validationError('Invalid sender');

    // Create batch
    const batch = await this.batchRepo.create({
      userId,
      senderId: data.senderId,
      subject: data.subject,
      body: data.body,
      totalRecipients: data.recipients.length,
      startTime: data.startTime,
      delaySeconds: data.delaySeconds,
      hourlyLimit: data.hourlyLimit,
    });

    const scheduleTimes = this.schedulingEngine.computeSchedule(
      data.startTime,
      data.delaySeconds,
      data.hourlyLimit,
      data.recipients.length
    );

    const jobsData = data.recipients.map((email, i) => ({
      batchId: batch.id,
      userId,
      recipientEmail: email,
      scheduledAt: scheduleTimes[i],
    }));

    const jobs = await this.jobRepo.createMany(jobsData);

    for (const job of jobs) {
      await this.queueService.enqueueEmailJob(job.id, job.scheduledAt);
    }

    const lastScheduledAt = scheduleTimes[scheduleTimes.length - 1];

    return {
      batchId: batch.id,
      totalRecipients: jobs.length,
      firstScheduledAt: scheduleTimes[0],
      lastScheduledAt,
      estimatedCompletionTime: lastScheduledAt,
    };
  }
}