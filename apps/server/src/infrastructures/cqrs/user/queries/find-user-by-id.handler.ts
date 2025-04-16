import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@application/ports/user.repository.port';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from '@infrastructures/cqrs/user/queries/find-user-by-id.query';
import { User } from '@/domain/user/user.entity';
import { Result } from '@shared/result';
@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<Result<User>> {
    const user: User | null = await this.userRepo.findById(query.id);

    if (!user) {
      return Result.fail('User not found');
    }
    return Result.ok(user);
  }
}
