import { EmailJobRepository } from '../repositories/emailJobRepository';
import { SmtpEmailProvider } from '../providers/smtpEmailProvider';
import { logger } from '../logger';

export class EmailDispatchService {
  constructor(
    private jobRepo: EmailJobRepository,
    private emailProvider: SmtpEmailProvider
  ) {}

  async dispatchEmail(emailJobId: string): Promise<void> {
    const job = await this.jobRepo.findById(emailJobId);
    if (!job) {
      logger.error({ emailJobId }, 'Job not found');
      return;
    }

    const marked = await this.jobRepo.markProcessing(emailJobId);
    if (!marked) {
      logger.info({ emailJobId }, 'Job already processed or not scheduled');
      return;
    }

    try {
      await this.emailProvider.send({
        from: { name: job.batch.sender.name, email: job.batch.sender.email },
        to: job.recipientEmail,
        subject: job.batch.subject,
        body: job.batch.body,
        smtpConfig: {
          host: job.batch.sender.smtpHost || 'smtp.ethereal.email',
          port: job.batch.sender.smtpPort || 587,
          user: job.batch.sender.smtpUser || '',
          password: job.batch.sender.smtpPassword || '',
        },
      });

      await this.jobRepo.markSent(emailJobId);
      logger.info({ emailJobId }, 'Email sent successfully');
    } catch (error: any) {
      await this.jobRepo.markFailed(emailJobId, error.message);
      logger.error({ emailJobId, error: error.message }, 'Email sending failed');
    }
  }
}