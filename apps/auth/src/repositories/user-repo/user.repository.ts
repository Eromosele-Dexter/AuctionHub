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
    first_name = '${user.first_name}',
    last_name = '${user.last_name}',
    username = '${user.username}',
    password = '${user.password}',
    email = '${user.email}',
    role = '${user.role}',
    street_name = '${user.street_name}',
    street_number = '${user.street_number}',
    postal_code = '${user.postal_code}',
    city = '${user.city}',
    country = '${user.country}',
    created_at = '${user.created_at}',
    updated_at = '${user.updated_at}'
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.dataSource.manager.query(`SELECT * FROM users WHERE email = '${email}'`);
    return user[0];
  }

  async getUsersByIds(userIds: number[]): Promise<User[]> {
    if (userIds.length === 0) return [];
    const users = await this.dataSource.manager.query(`SELECT * FROM users WHERE id IN (${userIds})`);
    return users;
  }
}
