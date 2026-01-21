import { z } from 'zod';

export const signupRequestDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export type SignupRequest = z.infer<typeof signupRequestDto>;