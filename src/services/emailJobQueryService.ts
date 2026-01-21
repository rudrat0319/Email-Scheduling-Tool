import { EmailJobRepository } from '../repositories/emailJobRepository';
import { emailJobRowDto } from '../dtos/email/emailJobRowDto';
import { paginatedEmailJobsResponseDto } from '../dtos/email/paginatedEmailJobaResponseDto';

export class EmailJobQueryService {
  constructor(private jobRepo: EmailJobRepository) {}

  async getScheduledJobs(userId: string, page: number, pageSize: number): Promise<paginatedEmailJobsResponseDto> {
    const { data, total } = await this.jobRepo.findScheduledAndProcessing(userId, page, pageSize);
    return {
      data: data.map(j => ({
        id: j.id,
        recipientEmail: j.recipientEmail,
        status: j.status as 'scheduled' | 'processing' | 'sent' | 'failed',
        scheduledAt: j.scheduledAt,
        sentAt: j.sentAt,
        failureReason: j.failureReason,
        subject: j.batch.subject,
        senderEmail: j.batch.sender.email,
        senderName: j.batch.sender.name,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}