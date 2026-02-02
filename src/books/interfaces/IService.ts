import { QueryOptions, PaginatedResponse } from './IRepository';

/**
 * Generic Service Interface
 * Defines contract for business logic operations
 */
export interface IService<T> {
    getAll(options?: QueryOptions): Promise<PaginatedResponse<T>>;
    getById(id: string): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
