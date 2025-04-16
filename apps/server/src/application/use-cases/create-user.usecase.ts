import { UserRepositoryPort } from '@application/ports/user.repository.port';
import { CreateUserDtoInput } from '@/application/dto/create-user-input.dto';
import { Result } from '@shared/result';
import { UserFactory } from '@/domain/user/user.factory';
import { User } from '@domain/user/user.entity';
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(
    createUserDtoInput: CreateUserDtoInput,
  ): Promise<Result<User, { username?: string; email?: string } | string>> {
    const [userExistsByUsername, userExistsByEmail] = await Promise.all([
      this.userRepo.findByUsername(createUserDtoInput.username),
      this.userRepo.findByEmail(createUserDtoInput.email),
    ]);
    if (userExistsByUsername || userExistsByEmail)
      return Result.fail('Identifiants incorrects.');

    const user: Result<User, { username?: string; email?: string } | string> =
      UserFactory.create(
        createUserDtoInput.id,
        createUserDtoInput.username,
        createUserDtoInput.email,
      );
    if (!user.success) return Result.fail(user.error);
    const savedUser: Result<
      User,
      { username?: string; email?: string } | string
    > = await this.userRepo.save(user.value);
    if (!savedUser.success)
      //TODO: faire un mapping des erreurs ?
      return Result.fail(
        "Erreur technique lors de la création de l'utilisateur.",
      );

    return Result.ok(savedUser.value);
  }
}
