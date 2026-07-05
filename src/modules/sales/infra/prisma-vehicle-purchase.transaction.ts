import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma.service';
import { EntityNotFoundError } from '../../../common/exceptions/domain-error';
import { Vehicle } from '../../vehicles/domain/vehicle.entity';
import { VehicleStatus } from '../../vehicles/domain/vehicle-status.enum';
import { Sale } from '../domain/sale.entity';
import { VehiclePurchaseTransaction } from '../domain/vehicle-purchase.transaction';

@Injectable()
export class PrismaVehiclePurchaseTransaction implements VehiclePurchaseTransaction {
  constructor(private readonly prisma: PrismaService) {}

  async purchase(vehicleId: string, buyerExternalId: string): Promise<Sale> {
    return this.prisma.$transaction(async (tx) => {
      const vehicleRecord = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicleRecord) {
        throw new EntityNotFoundError(`Vehicle with id ${vehicleId} not found`);
      }

      const vehicle = Vehicle.restore({
        id: vehicleRecord.id,
        brand: vehicleRecord.brand,
        model: vehicleRecord.model,
        year: vehicleRecord.year,
        color: vehicleRecord.color,
        price: Number(vehicleRecord.price),
        status: vehicleRecord.status as VehicleStatus,
        createdAt: vehicleRecord.createdAt,
        updatedAt: vehicleRecord.updatedAt,
      });

      vehicle.markAsSold();

      const sale = Sale.create({
        vehicleId,
        buyerExternalId,
        priceAtSale: vehicle.price,
      });

      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: vehicle.status, updatedAt: vehicle.updatedAt },
      });

      const saleProps = sale.toProps();
      const createdSale = await tx.sale.create({
        data: {
          id: saleProps.id,
          vehicleId: saleProps.vehicleId,
          buyerExternalId: saleProps.buyerExternalId,
          priceAtSale: saleProps.priceAtSale,
          soldAt: saleProps.soldAt,
          createdAt: saleProps.createdAt,
        },
      });

      return Sale.restore({
        id: createdSale.id,
        vehicleId: createdSale.vehicleId,
        buyerExternalId: createdSale.buyerExternalId,
        priceAtSale: Number(createdSale.priceAtSale),
        soldAt: createdSale.soldAt,
        createdAt: createdSale.createdAt,
      });
    });
  }
}
