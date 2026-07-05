export interface SaleProps {
  id: string;
  vehicleId: string;
  buyerExternalId: string;
  priceAtSale: number;
  soldAt: Date;
  createdAt: Date;
}

export interface CreateSaleProps {
  vehicleId: string;
  buyerExternalId: string;
  priceAtSale: number;
}

export class Sale {
  private constructor(private readonly props: SaleProps) {}

  static create(props: CreateSaleProps): Sale {
    const now = new Date();
    return new Sale({
      id: crypto.randomUUID(),
      vehicleId: props.vehicleId,
      buyerExternalId: props.buyerExternalId,
      priceAtSale: props.priceAtSale,
      soldAt: now,
      createdAt: now,
    });
  }

  static restore(props: SaleProps): Sale {
    return new Sale(props);
  }

  get id(): string {
    return this.props.id;
  }

  get vehicleId(): string {
    return this.props.vehicleId;
  }

  get buyerExternalId(): string {
    return this.props.buyerExternalId;
  }

  get priceAtSale(): number {
    return this.props.priceAtSale;
  }

  get soldAt(): Date {
    return this.props.soldAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toProps(): SaleProps {
    return { ...this.props };
  }
}
