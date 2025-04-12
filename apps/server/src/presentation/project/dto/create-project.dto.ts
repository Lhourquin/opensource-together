import { IsString, IsArray } from 'class-validator';

export class CreateProjectDtoRequest {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  link: string;
  @IsArray()
  stack: string[];
}
