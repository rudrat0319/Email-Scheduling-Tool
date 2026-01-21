import { Request, Response, NextFunction } from 'express';
import { SenderService } from '../services/senderService';

export class SenderController {
  constructor(private senderService: SenderService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const senders = await this.senderService.listSenders(req.user!.userId);
      res.json(senders);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sender = await this.senderService.createSender(req.user!.userId, req.body);
      res.status(201).json(sender);
    } catch (error) {
      next(error);
    }
  };
}