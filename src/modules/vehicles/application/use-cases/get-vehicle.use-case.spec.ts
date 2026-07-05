import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { EntityNotFoundError } from '../../../../common/exceptions/domain-error';
import { GetVehicleUseCase } from './get-vehicle.use-case';

describe('GetVehicleUseCase', () => {
  let repository: jest.Mocked<VehicleRepository>;
  let useCase: GetVehicleUseCase;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAvailableOrderedByPrice: jest.fn(),
      findSoldOrderedByPrice: jest.fn(),
    };
    useCase = new GetVehicleUseCase(repository);
  });

  it('returns the vehicle when found', async () => {
    const vehicle = Vehicle.create({
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      color: 'Prata',
      price: 95000,
    });
    repository.findById.mockResolvedValue(vehicle);

    const result = await useCase.execute(vehicle.id);

    expect(result).toBe(vehicle);
  });

  it('throws EntityNotFoundError when vehicle is missing', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(EntityNotFoundError);
  });
});
