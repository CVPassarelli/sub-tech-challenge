import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../../common/exceptions/domain-error';
import { Vehicle } from '../../domain/vehicle.entity';
import { VEHICLE_REPOSITORY, VehicleRepository } from '../../domain/vehicle.repository';

export interface UpdateVehicleInput {
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  price?: number;
}

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new EntityNotFoundError(`Vehicle with id ${id} not found`);
    }

    vehicle.update(input);
    return this.vehicleRepository.update(vehicle);
  }
}
