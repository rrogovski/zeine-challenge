import { SearchRequest } from 'src/infra/http/dtos/search-request';

export abstract class BaseRepository<T, ID> {
  abstract create(entity: T): Promise<Partial<T>>;
  abstract findAll(query: string): Promise<Partial<T>[]>;
  abstract findById(id: ID): Promise<Partial<T> | null>;
  abstract save(entity: T): Promise<Partial<T>>;
  abstract search(search: SearchRequest): Promise<Partial<T>[]>;
  abstract searchPagination(search: SearchRequest): Promise<Partial<T>[]>;
}
