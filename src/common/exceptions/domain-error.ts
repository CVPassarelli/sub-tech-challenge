export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class EntityNotFoundError extends DomainError {}

export class BusinessRuleViolationError extends DomainError {}

export class InvalidInputError extends DomainError {}
