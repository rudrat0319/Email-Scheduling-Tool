import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRepository } from '../repositories/userRepository';
import { conflictError } from "../errors/conflictError";
import { unauthorisedError } from "../errors/unauthorisedError";
import { authResponseDto } from '../dtos/auth/authResponseDto';
import { meResponseDto } from '../dtos/auth/meResponseDto';

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async signup(email: string, password: string, name: string): Promise<authResponseDto> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new conflictError('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ email, password: hashedPassword, name });

    const token = this.generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(email: string, password: string): Promise<authResponseDto> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.password) throw new unauthorisedError('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new unauthorisedError('Invalid credentials');

    const token = this.generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getProfile(userId: string): Promise<meResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new unauthorisedError();
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  verifyToken(token: string): { userId: string } {
    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string };
      return payload;
    } catch {
      throw new unauthorisedError('Invalid token');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign(
  { userId },
  config.JWT_SECRET,
  { expiresIn: config.JWT_EXPIRES_IN as any }
);
  }
}