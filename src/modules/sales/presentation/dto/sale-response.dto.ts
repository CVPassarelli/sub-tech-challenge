import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '../../domain/sale.entity';

export class SaleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  buyerExternalId: string;

  @ApiProperty()
  priceAtSale: number;

  @ApiProperty()
  soldAt: Date;

  constructor(sale: Sale) {
    this.id = sale.id;
    this.vehicleId = sale.vehicleId;
    this.buyerExternalId = sale.buyerExternalId;
    this.priceAtSale = sale.priceAtSale;
    this.soldAt = sale.soldAt;
  }
}
