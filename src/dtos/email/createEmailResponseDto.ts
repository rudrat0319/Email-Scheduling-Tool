export interface createEmailResponseDto {
  batchId: string;
  totalRecipients: number;
  firstScheduledAt: Date;
  lastScheduledAt: Date;
  estimatedCompletionTime: Date;
}