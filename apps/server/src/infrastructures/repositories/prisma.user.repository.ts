import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '@application/ports/user.repository.port';
import { User } from '@domain/user/user.entity';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { UserFactory } from '@domain/user/user.factory';
import { Result } from '@/shared/result';
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const userResult = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userResult) return null;
    const user = UserFactory.create(
      userResult.id,
      userResult.username,
      userResult.email,
    );
    if (!user.success) return null;
    return user.value;
  }

  async save(
    user: User,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    try {
      console.log('save');
      //throw new Error('test');
      const id = user.getId();
      const username = user.getUsername();
      const email = user.getEmail();
      const savedUser = await this.prisma.user.create({
        data: {
          id,
          username,
          email,
        },
      });
      if (!savedUser)
        return Result.fail("Erreur lors de la création de l'utilisateur.");
      const userResult: Result<
        User,
        { username?: string; email?: string } | string
      > = UserFactory.create(savedUser.id, savedUser.username, savedUser.email);
      if (!userResult.success) return Result.fail(userResult.error);
      return Result.ok(userResult.value);
    } catch (error) {
      //TODO: log l'erreur avec sentry
      console.log('error', error);
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const userResult = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!userResult) return null;
    const user = UserFactory.create(
      userResult.id,
      userResult.username,
      userResult.email,
    );
    if (!user.success) return null;
    return user.value;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userResult = await this.prisma.user.findFirst({
      where: { username },
    });
    if (!userResult) return null;
    const user = UserFactory.create(
      userResult.id,
      userResult.username,
      userResult.email,
    );
    if (!user.success) return null;
    return user.value;
  }
}
