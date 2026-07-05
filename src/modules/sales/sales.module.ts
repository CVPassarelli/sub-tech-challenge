import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SalesController } from './presentation/sales.controller';
import { PurchaseVehicleUseCase } from './application/use-cases/purchase-vehicle.use-case';
import { GetSaleUseCase } from './application/use-cases/get-sale.use-case';
import { SALE_REPOSITORY } from './domain/sale.repository';
import { PrismaSaleRepository } from './infra/prisma-sale.repository';
import { VEHICLE_PURCHASE_TRANSACTION } from './domain/vehicle-purchase.transaction';
import { PrismaVehiclePurchaseTransaction } from './infra/prisma-vehicle-purchase.transaction';

@Module({
  imports: [AuthModule],
  controllers: [SalesController],
  providers: [
    PurchaseVehicleUseCase,
    GetSaleUseCase,
    {
      provide: SALE_REPOSITORY,
      useClass: PrismaSaleRepository,
    },
    {
      provide: VEHICLE_PURCHASE_TRANSACTION,
      useClass: PrismaVehiclePurchaseTransaction,
    },
  ],
})
export class SalesModule {}
