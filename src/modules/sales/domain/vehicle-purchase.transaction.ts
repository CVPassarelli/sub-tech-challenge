import { Sale } from './sale.entity';

export const VEHICLE_PURCHASE_TRANSACTION = Symbol('VEHICLE_PURCHASE_TRANSACTION');

export interface VehiclePurchaseTransaction {
  purchase(vehicleId: string, buyerExternalId: string): Promise<Sale>;
}
