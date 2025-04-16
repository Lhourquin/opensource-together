import { Module } from '@nestjs/common';
import { ProjectModule } from '@presentation/project/project.module';
@Module({
  imports: [ProjectModule],
  controllers: [],
  providers: [],
})
export class PresentationModule {}
