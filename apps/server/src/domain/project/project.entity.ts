export class Project {
  private readonly id: string;
  private readonly name: string;
  private readonly description: string;
  private readonly title: string;
  private readonly link: string;
  private readonly stack: string;
  private readonly userId: string;
  constructor(
    id: string,
    name: string,
    description: string,
    title: string,
    link: string,
    stack: string,
    userId: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.title = title;
    this.link = link;
    this.stack = stack;
    this.userId = userId;
  }
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getDescription(): string {
    return this.description;
  }
  getTitle(): string {
    return this.title;
  }
  getLink(): string {
    return this.link;
  }
  getStack(): string {
    return this.stack;
  }
  getUserId(): string {
    return this.userId;
  }
}
