import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../../common/exceptions/domain-error';
import { Sale } from '../../domain/sale.entity';
import { SALE_REPOSITORY, SaleRepository } from '../../domain/sale.repository';

@Injectable()
export class GetSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new EntityNotFoundError(`Sale with id ${id} not found`);
    }
    return sale;
  }
}
