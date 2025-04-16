import { Module } from '@nestjs/common';
import { ProjectController } from '@presentation/project/project.controller';
@Module({
  controllers: [ProjectController],
})
export class ProjectModule {}
