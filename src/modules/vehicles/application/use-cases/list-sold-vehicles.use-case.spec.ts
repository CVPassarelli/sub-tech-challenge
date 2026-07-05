import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { ListSoldVehiclesUseCase } from './list-sold-vehicles.use-case';

describe('ListSoldVehiclesUseCase', () => {
  it('returns sold vehicles ordered by price from the repository', async () => {
    const vehicle = Vehicle.create({
      brand: 'Fiat',
      model: 'Uno',
      year: 2015,
      color: 'Branco',
      price: 30000,
    });
    vehicle.markAsSold();

    const repository: jest.Mocked<VehicleRepository> = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAvailableOrderedByPrice: jest.fn(),
      findSoldOrderedByPrice: jest.fn().mockResolvedValue([vehicle]),
    };
    const useCase = new ListSoldVehiclesUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([vehicle]);
    expect(repository.findSoldOrderedByPrice).toHaveBeenCalledTimes(1);
  });
});
