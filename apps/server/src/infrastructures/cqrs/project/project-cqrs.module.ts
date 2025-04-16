import { Module } from '@nestjs/common';
import { projectUsecaseHandlersContainer } from '@/infrastructures/cqrs/project/commands/project.commands';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
@Module({
  imports: [RepositoryModule],
  providers: [...projectUsecaseHandlersContainer],
  exports: [],
})
export class ProjectCqrsModule {}
