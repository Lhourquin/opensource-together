import { Result } from '@shared/result';
export class Username {
  private constructor(private readonly username: string) {}

  static create(username: string): Result<Username> {
    if (username.length < 3) {
      return Result.fail(
        "Le nom d'utilisateur doit comporter au moins 3 caractères",
      );
    }
    if (!username.match(/^[a-z0-9_-]+$/)) {
      return Result.fail(
        "Le nom d'utilisateur ne peut contenir que des caractères alphanumériques, des traits de soulignement ou des traits d'union.",
      );
    }

    return Result.ok(new Username(username));
  }

  public getUsername(): string {
    return this.username;
  }

  public static fromPersistence(username: string): Username {
    return new Username(username);
  }
}
