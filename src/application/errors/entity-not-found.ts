export class EntityNotFound extends Error {
  constructor(entityId: string) {
    super(`Entity with id ${entityId} not found`);
  }
}
