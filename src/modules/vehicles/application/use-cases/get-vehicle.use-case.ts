import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../../common/exceptions/domain-error';
import { Vehicle } from '../../domain/vehicle.entity';
import { VEHICLE_REPOSITORY, VehicleRepository } from '../../domain/vehicle.repository';

@Injectable()
export class GetVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new EntityNotFoundError(`Vehicle with id ${id} not found`);
    }
    return vehicle;
  }
}
