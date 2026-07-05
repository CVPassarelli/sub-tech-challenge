import { Sale } from '../../domain/sale.entity';
import { SaleRepository } from '../../domain/sale.repository';
import { EntityNotFoundError } from '../../../../common/exceptions/domain-error';
import { GetSaleUseCase } from './get-sale.use-case';

describe('GetSaleUseCase', () => {
  it('returns the sale when found', async () => {
    const sale = Sale.create({
      vehicleId: 'vehicle-1',
      buyerExternalId: 'buyer-1',
      priceAtSale: 95000,
    });
    const repository: jest.Mocked<SaleRepository> = {
      findById: jest.fn().mockResolvedValue(sale),
    };
    const useCase = new GetSaleUseCase(repository);

    const result = await useCase.execute(sale.id);

    expect(result).toBe(sale);
  });

  it('throws EntityNotFoundError when sale is missing', async () => {
    const repository: jest.Mocked<SaleRepository> = {
      findById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetSaleUseCase(repository);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(EntityNotFoundError);
  });
});
