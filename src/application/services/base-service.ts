import { SearchPaginationRequest } from 'src/infra/http/dtos/search-pagination-request';
import { SearchRequest } from 'src/infra/http/dtos/search-request';

export abstract class BaseService<T, ID, R> {
  protected repository: R;
  abstract create(entity: T): Promise<Partial<T>>;
  abstract findAll(query: String): Promise<Partial<T>[]>;
  abstract findById(id: ID): Promise<Partial<T> | null>;
  abstract save(entity: T): Promise<Partial<T>>;
  abstract search(search: SearchRequest): Promise<Partial<T>[]>;
  abstract searchPagination(
    search: SearchPaginationRequest,
  ): Promise<Partial<T>[]>;
}
