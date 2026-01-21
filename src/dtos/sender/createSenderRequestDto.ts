import { z } from 'zod';

export const createSenderRequestDto = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email format'),
  smtpHost: z.string().min(1, 'SMTP host is required').optional(),
  smtpPort: z.number().int().min(1).max(65535, 'Invalid port number').optional(),
  smtpUser: z.string().min(1, 'SMTP user is required').optional(),
  smtpPassword: z.string().min(1, 'SMTP password is required').optional(),
}).refine(
  (data) => {
    // If any SMTP field is provided, all must be provided
    const smtpFields = [data.smtpHost, data.smtpPort, data.smtpUser, data.smtpPassword];
    const providedCount = smtpFields.filter(field => field !== undefined).length;
    return providedCount === 0 || providedCount === 4;
  },
  {
    message: 'Either provide all SMTP credentials or none',
    path: ['smtpHost'],
  }
);

export type CreateSenderRequest = z.infer<typeof createSenderRequestDto>;