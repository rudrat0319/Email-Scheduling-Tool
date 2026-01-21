import { Repository } from 'typeorm';
import { AppDataSource } from '../db/data-source';
import { EmailBatch } from '../Entity/emailBatchEntity';

export class EmailBatchRepository {
  private repo: Repository<EmailBatch>;

  constructor() {
    this.repo = AppDataSource.getRepository(EmailBatch);
  }

  async create(data: {
    userId: string;
    senderId: string;
    subject: string;
    body: string;
    totalRecipients: number;
    startTime: Date;
    delaySeconds: number;
    hourlyLimit: number;
  }): Promise<EmailBatch> {
    const batch = this.repo.create(data);
    return this.repo.save(batch);
  }

  async findById(id: string): Promise<EmailBatch | null> {
    return this.repo.findOne({ where: { id }, relations: ['sender'] });
  }
}