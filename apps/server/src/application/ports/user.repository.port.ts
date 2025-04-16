import { User } from '@domain/user/user.entity';
import { Result } from '@shared/result';
export const USER_REPOSITORY_PORT = Symbol('UserRepository');
export interface UserRepositoryPort {
  save(
    user: User,
  ): Promise<Result<User, { username?: string; email?: string } | string>>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
