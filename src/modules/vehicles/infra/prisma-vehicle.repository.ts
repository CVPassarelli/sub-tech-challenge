import { Injectable } from '@nestjs/common';
import { Vehicle as PrismaVehicle } from '@prisma/client';
import { PrismaService } from '../../../infra/database/prisma.service';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleStatus } from '../domain/vehicle-status.enum';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const props = vehicle.toProps();
    const created = await this.prisma.vehicle.create({
      data: {
        id: props.id,
        brand: props.brand,
        model: props.model,
        year: props.year,
        color: props.color,
        price: props.price,
        status: props.status,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(vehicle: Vehicle): Promise<Vehicle> {
    const props = vehicle.toProps();
    const updated = await this.prisma.vehicle.update({
      where: { id: props.id },
      data: {
        brand: props.brand,
        model: props.model,
        year: props.year,
        color: props.color,
        price: props.price,
        status: props.status,
        updatedAt: props.updatedAt,
      },
    });
    return this.toDomain(updated);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    return vehicle ? this.toDomain(vehicle) : null;
  }

  async findAvailableOrderedByPrice(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { status: VehicleStatus.AVAILABLE },
      orderBy: { price: 'asc' },
    });
    return vehicles.map((vehicle) => this.toDomain(vehicle));
  }

  async findSoldOrderedByPrice(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { status: VehicleStatus.SOLD },
      orderBy: { price: 'asc' },
    });
    return vehicles.map((vehicle) => this.toDomain(vehicle));
  }

  private toDomain(vehicle: PrismaVehicle): Vehicle {
    return Vehicle.restore({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: Number(vehicle.price),
      status: vehicle.status as VehicleStatus,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    });
  }
}
