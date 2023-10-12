import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(user: User): Promise<User> {
    this.dataSource.manager.create(User, user);
    return this.save(user);
  }
  async getUserById(id: number) {
    const user = await this.dataSource.manager.query(`SELECT * FROM users WHERE id = ${id}`);
    return user[0];
  }
  async getUsers(): Promise<User[]> {
    const users = await this.dataSource.manager.query(`SELECT * FROM users`);
    return users;
  }
  async updateUser(user: User): Promise<User> {
    const updatedUser = await this.dataSource.manager.query(`UPDATE users SET
    firstName = '${user.firstName}',
    lastName = '${user.lastName}',
    username = '${user.username}',
    password = '${user.password}',
    email = '${user.email}',
    role = '${user.role}',
    streetName = '${user.streetName}',
    streetNumber = '${user.streetNumber}',
    postalCode = '${user.postalCode}',
    city = '${user.city}',
    country = '${user.country}',
    createdAt = '${user.createdAt}',
    updatedAt = '${user.updatedAt}'
    WHERE id = ${user.id}`);

    this.save(updatedUser[0]);
    return updatedUser[0];
  }
  async deleteUser(id: number): Promise<void> {
    this.delete(id);
  }
  async getUserByUsername(username: string): Promise<User> {
    const user = await this.dataSource.manager.query(`SELECT * FROM users WHERE username = '${username}'`);
    return user[0];
  }
}
