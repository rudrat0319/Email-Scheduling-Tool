import { Repository } from 'typeorm';
import { AppDataSource } from '../db/data-source';
import { Sender } from '../Entity/senderEntity';

export class SenderRepository {
  private repo: Repository<Sender>;

  constructor() {
    this.repo = AppDataSource.getRepository(Sender);
  }

  async create(data: {
    userId: string;
    name: string;
    email: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
  }): Promise<Sender> {
    const sender = this.repo.create(data);
    return this.repo.save(sender);
  }

  async findByUserId(userId: string): Promise<Sender[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Sender | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Sender | null> {
    return this.repo.findOne({ where: { id, userId } });
  }
}