import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { ListAvailableVehiclesUseCase } from './list-available-vehicles.use-case';

describe('ListAvailableVehiclesUseCase', () => {
  it('returns vehicles ordered by price from the repository', async () => {
    const vehicles = [
      Vehicle.create({ brand: 'Fiat', model: 'Uno', year: 2015, color: 'Branco', price: 30000 }),
      Vehicle.create({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'Prata',
        price: 95000,
      }),
    ];
    const repository: jest.Mocked<VehicleRepository> = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAvailableOrderedByPrice: jest.fn().mockResolvedValue(vehicles),
      findSoldOrderedByPrice: jest.fn(),
    };
    const useCase = new ListAvailableVehiclesUseCase(repository);

    const result = await useCase.execute();

    expect(result).toBe(vehicles);
    expect(repository.findAvailableOrderedByPrice).toHaveBeenCalledTimes(1);
  });
});
