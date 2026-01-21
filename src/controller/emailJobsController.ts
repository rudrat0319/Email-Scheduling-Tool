import { Request, Response, NextFunction } from 'express';
import { EmailJobQueryService } from '../services/EmailJobQueryService';

export class EmailJobsController {
  constructor(private queryService: EmailJobQueryService) {}

  getScheduled = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = req.query as any;
      const result = await this.queryService.getScheduledJobs(req.user!.userId, page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getSent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = req.query as any;
      const result = await this.queryService.getSentJobs(req.user!.userId, page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}