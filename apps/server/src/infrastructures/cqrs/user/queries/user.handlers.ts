import { UserExistHandler } from '@infrastructures/cqrs/user/queries/user-exist.handler';
import { FindEmailByUsernameHandler } from '@infrastructures/cqrs/user/queries/find-email-by-username.handler';
import { FindUserByIdHandler } from '@infrastructures/cqrs/user/queries/find-user-by-id.handler';
export const userHandlerContainer = [
  UserExistHandler,
  FindEmailByUsernameHandler,
  FindUserByIdHandler,
];
