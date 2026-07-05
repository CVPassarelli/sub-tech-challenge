import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VEHICLE_REPOSITORY, VehicleRepository } from '../../domain/vehicle.repository';

@Injectable()
export class ListSoldVehiclesUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findSoldOrderedByPrice();
  }
}
