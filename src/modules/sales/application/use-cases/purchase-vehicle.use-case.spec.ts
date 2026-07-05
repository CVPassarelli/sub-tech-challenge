import { Sale } from '../../domain/sale.entity';
import { VehiclePurchaseTransaction } from '../../domain/vehicle-purchase.transaction';
import { BusinessRuleViolationError } from '../../../../common/exceptions/domain-error';
import { PurchaseVehicleUseCase } from './purchase-vehicle.use-case';

describe('PurchaseVehicleUseCase', () => {
  it('delegates the purchase to the transaction port', async () => {
    const sale = Sale.create({
      vehicleId: 'vehicle-1',
      buyerExternalId: 'buyer-1',
      priceAtSale: 95000,
    });
    const transaction: jest.Mocked<VehiclePurchaseTransaction> = {
      purchase: jest.fn().mockResolvedValue(sale),
    };
    const useCase = new PurchaseVehicleUseCase(transaction);

    const result = await useCase.execute('vehicle-1', 'buyer-1');

    expect(result).toBe(sale);
    expect(transaction.purchase).toHaveBeenCalledWith('vehicle-1', 'buyer-1');
  });

  it('propagates business rule violations from the transaction', async () => {
    const transaction: jest.Mocked<VehiclePurchaseTransaction> = {
      purchase: jest
        .fn()
        .mockRejectedValue(new BusinessRuleViolationError('Vehicle is already sold')),
    };
    const useCase = new PurchaseVehicleUseCase(transaction);

    await expect(useCase.execute('vehicle-1', 'buyer-1')).rejects.toThrow(
      BusinessRuleViolationError,
    );
  });
});
