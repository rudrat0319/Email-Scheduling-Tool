import { Router } from 'express';
import { AuthController } from './controllers/authController';
import { SenderController } from './controllers/senderController';
import { EmailBatchController } from './controllers/emailBatchController';
import { EmailJobsController } from './controllers/emailJobsController';
import { validate, validateQuery } from './middleware/validationMiddleware';
import { SignupRequestDto } from './dtos/auth/signupRequestDto';
import { LoginRequestDto } from './dtos/auth/loginRequestDto';
import { CreateSenderRequestDto } from './dtos/sender/createSenderRequestDto';
import { CreateEmailBatchRequestDto } from './dtos/email/createEmailBatchRequestDto';
import { PaginationQueryDto } from './dtos/pagination/paginationsQueryDto';

export const createRouter = (
  authController: AuthController,
  senderController: SenderController,
  emailBatchController: EmailBatchController,
  emailJobsController: EmailJobsController,
  authMiddleware: any
) => {
  const router = Router();

  router.post('/auth/signup', validate(SignupRequestDto), authController.signup);
  router.post('/auth/login', validate(LoginRequestDto), authController.login);
  router.get('/auth/me', authMiddleware, authController.me);

  router.get('/senders', authMiddleware, senderController.list);
  router.post('/senders', authMiddleware, validate(CreateSenderRequestDto), senderController.create);

  router.post('/email-batches', authMiddleware, validate(CreateEmailBatchRequestDto), emailBatchController.schedule);

  router.get('/email-jobs/scheduled', authMiddleware, validateQuery(PaginationQueryDto), emailJobsController.getScheduled);
  router.get('/email-jobs/sent', authMiddleware, validateQuery(PaginationQueryDto), emailJobsController.getSent);

  return router;
};