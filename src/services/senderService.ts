import { SenderRepository } from '../repositories/senderRepository';
import { forbiddenError } from '../errors/forbiddenError';
import { senderDto } from '../dtos/sender/senderDto';
import { CreateSenderRequest } from '../dtos/sender/createSenderRequestDto';

export class SenderService {
  constructor(private senderRepo: SenderRepository) {}

  async listSenders(userId: string): Promise<senderDto[]> {
    const senders = await this.senderRepo.findByUserId(userId);
    return senders.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      hasSmtpConfig: !!(s.smtpHost && s.smtpPort && s.smtpUser && s.smtpPassword),
      createdAt: s.createdAt,
    }));
  }

  async createSender(userId: string, data: CreateSenderRequest): Promise<senderDto> {
    const sender = await this.senderRepo.create({ userId, ...data });
    return {
      id: sender.id,
      name: sender.name,
      email: sender.email,
      hasSmtpConfig: !!(sender.smtpHost && sender.smtpPort && sender.smtpUser && sender.smtpPassword),
      createdAt: sender.createdAt,
    };
  }

  async verifySenderOwnership(senderId: string, userId: string): Promise<void> {
    const sender = await this.senderRepo.findByIdAndUserId(senderId, userId);
    if (!sender) throw new forbiddenError('Sender not found or access denied');
  }
}