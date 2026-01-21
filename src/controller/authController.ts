import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  constructor(private authService: AuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.signup(email, password, name);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.getProfile(req.user!.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}