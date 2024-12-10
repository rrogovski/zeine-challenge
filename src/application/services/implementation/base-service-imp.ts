import { Injectable } from '@nestjs/common';
import { BaseRepository } from './../../repositories/base-repository';
import { BaseService } from '../base-service';
import { SearchRequest } from 'src/infra/http/dtos/search-request';
import { SearchPaginationRequest } from 'src/infra/http/dtos/search-pagination-request';

@Injectable()
export class BaseServiceImp<
  T,
  ID,
  R extends BaseRepository<T, ID>,
> extends BaseService<T, ID, R> {
  protected repository: R;

  constructor(repository: R) {
    super();
    this.repository = repository;
  }

  async create(entity: T): Promise<Partial<T>> {
    return await this.repository.create(entity);
  }

  async findAll(query: string): Promise<Partial<T>[]> {
    return await this.repository.findAll(query);
  }

  async findById(id: ID): Promise<Partial<T> | null> {
    return await this.repository.findById(id);
  }

  async save(entity: T): Promise<Partial<T>> {
    return await this.repository.save(entity);
  }

  async search(search: SearchRequest): Promise<Partial<T>[]> {
    return await this.repository.search(search);
  }

  async searchPagination(
    search: SearchPaginationRequest,
  ): Promise<Partial<T>[]> {
    return await this.repository.searchPagination(search);
  }
}
