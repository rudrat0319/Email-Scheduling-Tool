import { z } from 'zod';
import { SCHEDULING } from '../../config/constants';

export const createEmailBatchRequestDto = z.object({
  senderId: z.string().uuid('Invalid sender ID'),
  subject: z.string().min(1, 'Subject is required').max(500, 'Subject too long'),
  body: z.string().min(1, 'Body is required'),
  recipients: z
    .array(z.string().email('Invalid email format'))
    .min(1, 'At least one recipient required')
    .max(SCHEDULING.MAX_RECIPIENTS, `Maximum ${SCHEDULING.MAX_RECIPIENTS} recipients allowed`),
  startTime: z.string().datetime('Invalid datetime format'),
  delaySeconds: z
    .number()
    .int('Delay must be an integer')
    .min(SCHEDULING.MIN_DELAY_SECONDS, `Minimum delay is ${SCHEDULING.MIN_DELAY_SECONDS} seconds`)
    .max(SCHEDULING.MAX_DELAY_SECONDS, `Maximum delay is ${SCHEDULING.MAX_DELAY_SECONDS} seconds`),
  hourlyLimit: z
    .number()
    .int('Hourly limit must be an integer')
    .min(SCHEDULING.MIN_HOURLY_LIMIT, `Minimum hourly limit is ${SCHEDULING.MIN_HOURLY_LIMIT}`)
    .max(SCHEDULING.MAX_HOURLY_LIMIT, `Maximum hourly limit is ${SCHEDULING.MAX_HOURLY_LIMIT}`),
});

export type CreateEmailBatchRequest = z.infer<typeof createEmailBatchRequestDto>;