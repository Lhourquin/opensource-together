import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '@application/ports/user.repository.port';
import { User } from '@domain/user/user.entity';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { UserFactory } from '@domain/user/user.factory';
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

  async save(user: User): Promise<void> {
    const id = user.getId();
    const username = user.getUsername();
    const email = user.getEmail();
    await this.prisma.user.create({
      data: {
        id,
        username,
        email,
      },
    });
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
