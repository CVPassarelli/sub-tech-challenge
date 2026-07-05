import { Sale } from './sale.entity';

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');

export interface SaleRepository {
  findById(id: string): Promise<Sale | null>;
}
