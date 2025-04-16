//import { Project } from '@domain/project/project.entity';

export const PROJECT_REPOSITORY_PORT = Symbol('ProjectRepositoryPort');

export interface createProjectInput {
  name: string;
  description: string;
  link: string;
  stack: string[];
  userId: string;
}
export interface ProjectRepositoryPort {
  save(project: createProjectInput): Promise<void>;
}
