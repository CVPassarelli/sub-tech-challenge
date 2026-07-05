import { Inject, Injectable } from '@nestjs/common';
import { Sale } from '../../domain/sale.entity';
import {
  VEHICLE_PURCHASE_TRANSACTION,
  VehiclePurchaseTransaction,
} from '../../domain/vehicle-purchase.transaction';

@Injectable()
export class PurchaseVehicleUseCase {
  constructor(
    @Inject(VEHICLE_PURCHASE_TRANSACTION)
    private readonly vehiclePurchaseTransaction: VehiclePurchaseTransaction,
  ) {}

  async execute(vehicleId: string, buyerExternalId: string): Promise<Sale> {
    return this.vehiclePurchaseTransaction.purchase(vehicleId, buyerExternalId);
  }
}
