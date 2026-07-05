import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VEHICLE_REPOSITORY, VehicleRepository } from '../../domain/vehicle.repository';

export interface CreateVehicleInput {
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
}

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    const vehicle = Vehicle.create(input);
    return this.vehicleRepository.create(vehicle);
  }
}
