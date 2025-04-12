import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from '@/infrastructures/cqrs/project/commands/create-project.command';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@application/ports/project.repository.port';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(command: CreateProjectCommand): Promise<void> {
    await this.projectRepository.save(command);
  }
}
