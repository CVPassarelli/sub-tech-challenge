import { Module } from '@nestjs/common';
import { VehiclesController } from './presentation/vehicles.controller';
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle.use-case';
import { UpdateVehicleUseCase } from './application/use-cases/update-vehicle.use-case';
import { GetVehicleUseCase } from './application/use-cases/get-vehicle.use-case';
import { ListAvailableVehiclesUseCase } from './application/use-cases/list-available-vehicles.use-case';
import { ListSoldVehiclesUseCase } from './application/use-cases/list-sold-vehicles.use-case';
import { VEHICLE_REPOSITORY } from './domain/vehicle.repository';
import { PrismaVehicleRepository } from './infra/prisma-vehicle.repository';

@Module({
  controllers: [VehiclesController],
  providers: [
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    GetVehicleUseCase,
    ListAvailableVehiclesUseCase,
    ListSoldVehiclesUseCase,
    {
      provide: VEHICLE_REPOSITORY,
      useClass: PrismaVehicleRepository,
    },
  ],
  exports: [VEHICLE_REPOSITORY],
})
export class VehiclesModule {}
