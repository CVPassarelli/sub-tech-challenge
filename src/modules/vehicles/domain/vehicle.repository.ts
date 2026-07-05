import { Vehicle } from './vehicle.entity';

export const VEHICLE_REPOSITORY = Symbol('VEHICLE_REPOSITORY');

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findAvailableOrderedByPrice(): Promise<Vehicle[]>;
  findSoldOrderedByPrice(): Promise<Vehicle[]>;
}
