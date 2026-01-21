import { Repository, In } from 'typeorm';
import { AppDataSource } from '../db/data-source';
import { EmailJob } from '../Entity/emailJobEntity';
import { JobStatus } from '../config/constants';

export class EmailJobRepository {
  private repo: Repository<EmailJob>;

  constructor() {
    this.repo = AppDataSource.getRepository(EmailJob);
  }

  async createMany(jobs: Array<{
    batchId: string;
    userId: string;
    recipientEmail: string;
    scheduledAt: Date;
  }>): Promise<EmailJob[]> {
    const entities = this.repo.create(jobs);
    return this.repo.save(entities);
  }

  async findById(id: string): Promise<EmailJob | null> {
    return this.repo.findOne({ where: { id }, relations: ['batch', 'batch.sender'] });
  }

  async findScheduledAndProcessing(userId: string, page: number, pageSize: number) {
    const [data, total] = await this.repo.findAndCount({
      where: { userId, status: In([JobStatus.SCHEDULED, JobStatus.PROCESSING]) },
      relations: ['batch', 'batch.sender'],
      order: { scheduledAt: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, total };
  }

  async findSentAndFailed(userId: string, page: number, pageSize: number) {
    const [data, total] = await this.repo.findAndCount({
      where: { userId, status: In([JobStatus.SENT, JobStatus.FAILED]) },
      relations: ['batch', 'batch.sender'],
      order: { sentAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, total };
  }

  async markProcessing(id: string): Promise<boolean> {
    const result = await this.repo.update(
      { id, status: JobStatus.SCHEDULED },
      { status: JobStatus.PROCESSING }
    );
    return result.affected === 1;
  }

  async markSent(id: string): Promise<void> {
    await this.repo.update(id, { status: JobStatus.SENT, sentAt: new Date() });
  }

  async markFailed(id: string, reason: string): Promise<void> {
    await this.repo.update(id, { status: JobStatus.FAILED, failureReason: reason });
  }
}