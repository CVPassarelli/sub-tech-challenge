import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleStatus } from '../../domain/vehicle-status.enum';

export class VehicleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  color: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.brand = vehicle.brand;
    this.model = vehicle.model;
    this.year = vehicle.year;
    this.color = vehicle.color;
    this.price = vehicle.price;
    this.status = vehicle.status;
    this.createdAt = vehicle.createdAt;
    this.updatedAt = vehicle.updatedAt;
  }
}
