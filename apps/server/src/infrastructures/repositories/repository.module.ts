import { Module } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '@application/ports/user.repository.port';
import { PrismaService } from '@infrastructures/orm/prisma/prisma.service';
import { PrismaUserRepository } from '@infrastructures/repositories/prisma.user.repository';
import { PrismaProjectRepository } from '@infrastructures/repositories/prisma.project.repository';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
  ],
  imports: [],
  exports: [PrismaService, USER_REPOSITORY_PORT, PROJECT_REPOSITORY_PORT],
})
export class RepositoryModule {}
