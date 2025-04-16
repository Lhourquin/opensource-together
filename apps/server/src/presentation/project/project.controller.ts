import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { Session } from 'supertokens-nestjs';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { FindUserByIdQuery } from '@infrastructures/cqrs/user/queries/find-user-by-id.query';
import { User } from '@domain/user/user.entity';
import { CreateProjectCommand } from '@infrastructures/cqrs/project/commands/create-project.command';
import { CreateProjectDtoRequest } from '@presentation/project/dto/create-project.dto';
import { Result } from '@shared/result';
@Controller('project')
export class ProjectController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async createProject(
    @Session('userId') userId: string,
    @Body() createProjectDtoRequest: CreateProjectDtoRequest,
  ) {
    const user: Result<User> = await this.queryBus.execute(
      new FindUserByIdQuery(userId),
    );
    if (!user.success) {
      throw new UnauthorizedException();
    }
    await this.commandBus.execute(
      new CreateProjectCommand(
        createProjectDtoRequest.name,
        createProjectDtoRequest.description,
        createProjectDtoRequest.link,
        createProjectDtoRequest.stack,
        user.value.getId(),
      ),
    );
  }
}
