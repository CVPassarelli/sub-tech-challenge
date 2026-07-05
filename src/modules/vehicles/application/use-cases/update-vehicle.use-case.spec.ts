import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { EntityNotFoundError } from '../../../../common/exceptions/domain-error';
import { UpdateVehicleUseCase } from './update-vehicle.use-case';

describe('UpdateVehicleUseCase', () => {
  let repository: jest.Mocked<VehicleRepository>;
  let useCase: UpdateVehicleUseCase;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn().mockImplementation((vehicle) => Promise.resolve(vehicle)),
      findById: jest.fn(),
      findAvailableOrderedByPrice: jest.fn(),
      findSoldOrderedByPrice: jest.fn(),
    };
    useCase = new UpdateVehicleUseCase(repository);
  });

  it('updates an existing vehicle', async () => {
    const vehicle = Vehicle.create({
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      color: 'Prata',
      price: 95000,
    });
    repository.findById.mockResolvedValue(vehicle);

    const updated = await useCase.execute(vehicle.id, { price: 100000 });

    expect(updated.price).toBe(100000);
    expect(repository.update).toHaveBeenCalledWith(vehicle);
  });

  it('throws when vehicle does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id', { price: 100000 })).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
