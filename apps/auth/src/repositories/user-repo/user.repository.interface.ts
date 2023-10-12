import { User } from '../../entities/user.entity';

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  getUserById(id: number): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getUserByUsername(username: string): Promise<User>;
}
