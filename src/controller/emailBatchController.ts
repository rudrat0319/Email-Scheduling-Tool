import { Request, Response, NextFunction } from 'express';
import { EmailSchedulingService } from '../services/EmailSchedulingService';

export class EmailBatchController {
  constructor(private schedulingService: EmailSchedulingService) {}

  schedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senderId, subject, body, recipients, startTime, delaySeconds, hourlyLimit } = req.body;
      
      const result = await this.schedulingService.scheduleEmailBatch(req.user!.userId, {
        senderId,
        subject,
        body,
        recipients,
        startTime: new Date(startTime),
        delaySeconds,
        hourlyLimit,
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}