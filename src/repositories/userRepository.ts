import { Repository } from 'typeorm';
import { AppDataSource } from '../db/data-source';
import { user } from '../Entity/userEntity';

export class UserRepository {
  private repo: Repository<user>;

  constructor() {
    this.repo = AppDataSource.getRepository(user);
  }

  async create(data: { email: string; name: string; password?: string; googleId?: string }): Promise<user> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<user | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<user | null> {
    return this.repo.findOne({ where: { googleId } });
  }

  async findById(id: string): Promise<user | null> {
    return this.repo.findOne({ where: { id } });
  }
}