import express from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './middleware/requestIdMiddleware';
import { errorHandler } from './middleware/errorHandlerMiddleware';
import { createAuthMiddleware } from './middleware/authMiddleware';
import { createRouter } from './routes';
import { AuthController } from './controllers/authController';
import { SenderController } from './controllers/senderController';
import { EmailBatchController } from './controllers/emailBatchController';
import { EmailJobsController } from './controllers/emailJobsController';
import { AuthService } from './services/authService';
import { SenderService } from './services/SenderService';
import { EmailSchedulingService } from './services/EmailSchedulingService';
import { EmailJobQueryService } from './services/EmailJobQueryService';
import { SchedulingEngine } from './services/schedulingEngine';
import { UserRepository } from './repositories/UserRepository';
import { SenderRepository } from './repositories/SenderRepository';
import { EmailBatchRepository } from './repositories/EmailBatchRepository';
import { EmailJobRepository } from './repositories/EmailJobRepository';
import { BullMQEmailQueueService } from './queue/BullMQEmailQueueService';

export const createApp = () => {
  const app = express();

  const userRepo = new UserRepository();
  const senderRepo = new SenderRepository();
  const batchRepo = new EmailBatchRepository();
  const jobRepo = new EmailJobRepository();

  const authService = new AuthService(userRepo);
  const senderService = new SenderService(senderRepo);
  const schedulingEngine = new SchedulingEngine();
  const queueService = new BullMQEmailQueueService();
  const schedulingService = new EmailSchedulingService(batchRepo, jobRepo, senderRepo, schedulingEngine, queueService);
  const queryService = new EmailJobQueryService(jobRepo);

  const authController = new AuthController(authService);
  const senderController = new SenderController(senderService);
  const batchController = new EmailBatchController(schedulingService);
  const jobsController = new EmailJobsController(queryService);

  app.use(cors());
  app.use(express.json());
  app.use(requestIdMiddleware);

  const authMiddleware = createAuthMiddleware(authService);
  const router = createRouter(authController, senderController, batchController, jobsController, authMiddleware);
  app.use('/api', router);

  app.use(errorHandler);

  return app;
};