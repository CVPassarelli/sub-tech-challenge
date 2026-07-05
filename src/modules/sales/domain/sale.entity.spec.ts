import { Sale } from './sale.entity';

describe('Sale', () => {
  it('creates a sale freezing the price at the moment of purchase', () => {
    const sale = Sale.create({
      vehicleId: 'vehicle-1',
      buyerExternalId: 'buyer-1',
      priceAtSale: 95000,
    });

    expect(sale.id).toBeDefined();
    expect(sale.vehicleId).toBe('vehicle-1');
    expect(sale.buyerExternalId).toBe('buyer-1');
    expect(sale.priceAtSale).toBe(95000);
    expect(sale.soldAt).toBeInstanceOf(Date);
  });
});
