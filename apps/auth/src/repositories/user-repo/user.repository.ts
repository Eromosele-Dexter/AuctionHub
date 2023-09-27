import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private readonly logger = new Logger(UserRepository.name);

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async getUserById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async getUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async updateUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async deleteUser(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getUserByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
