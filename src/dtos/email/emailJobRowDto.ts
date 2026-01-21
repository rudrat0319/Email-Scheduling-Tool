export interface emailJobRowDto {
  id: string;
  recipientEmail: string;
  status: 'scheduled' | 'processing' | 'sent' | 'failed';
  scheduledAt: Date;
  sentAt?: Date;
  failureReason?: string;
  subject: string;
  senderEmail: string;
  senderName: string;
}