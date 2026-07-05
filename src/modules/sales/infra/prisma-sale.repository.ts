import { Injectable } from '@nestjs/common';
import { Sale as PrismaSale } from '@prisma/client';
import { PrismaService } from '../../../infra/database/prisma.service';
import { Sale } from '../domain/sale.entity';
import { SaleRepository } from '../domain/sale.repository';

@Injectable()
export class PrismaSaleRepository implements SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({ where: { id } });
    return sale ? this.toDomain(sale) : null;
  }

  private toDomain(sale: PrismaSale): Sale {
    return Sale.restore({
      id: sale.id,
      vehicleId: sale.vehicleId,
      buyerExternalId: sale.buyerExternalId,
      priceAtSale: Number(sale.priceAtSale),
      soldAt: sale.soldAt,
      createdAt: sale.createdAt,
    });
  }
}
