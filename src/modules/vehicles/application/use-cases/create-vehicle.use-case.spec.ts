import { VehicleRepository } from '../../domain/vehicle.repository';
import { InvalidInputError } from '../../../../common/exceptions/domain-error';
import { CreateVehicleUseCase } from './create-vehicle.use-case';

describe('CreateVehicleUseCase', () => {
  let repository: jest.Mocked<VehicleRepository>;
  let useCase: CreateVehicleUseCase;

  beforeEach(() => {
    repository = {
      create: jest.fn().mockImplementation((vehicle) => Promise.resolve(vehicle)),
      update: jest.fn(),
      findById: jest.fn(),
      findAvailableOrderedByPrice: jest.fn(),
      findSoldOrderedByPrice: jest.fn(),
    };
    useCase = new CreateVehicleUseCase(repository);
  });

  it('creates and persists a vehicle', async () => {
    const vehicle = await useCase.execute({
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      color: 'Prata',
      price: 95000,
    });

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(vehicle.brand).toBe('Toyota');
  });

  it('propagates domain validation errors', async () => {
    await expect(
      useCase.execute({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'Prata',
        price: -1,
      }),
    ).rejects.toThrow(InvalidInputError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
