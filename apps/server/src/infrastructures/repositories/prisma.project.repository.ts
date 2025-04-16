import { Injectable } from '@nestjs/common';
import {
  createProjectInput,
  ProjectRepositoryPort,
} from '@application/ports/project.repository.port';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(project: createProjectInput): Promise<void> {
    await this.prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
        link: project.link,
        stack: project.stack,
        userId: project.userId,
      },
    });
  }
}
