import {
  BusinessRuleViolationError,
  InvalidInputError,
} from '../../../common/exceptions/domain-error';
import { VehicleStatus } from './vehicle-status.enum';

export interface VehicleProps {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleProps {
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
}

export interface UpdateVehicleProps {
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  price?: number;
}

const MIN_VALID_YEAR = 1900;

export class Vehicle {
  private constructor(private readonly props: VehicleProps) {}

  static create(props: CreateVehicleProps): Vehicle {
    Vehicle.validatePrice(props.price);
    Vehicle.validateYear(props.year);

    const now = new Date();
    return new Vehicle({
      id: crypto.randomUUID(),
      brand: props.brand,
      model: props.model,
      year: props.year,
      color: props.color,
      price: props.price,
      status: VehicleStatus.AVAILABLE,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: VehicleProps): Vehicle {
    return new Vehicle(props);
  }

  update(props: UpdateVehicleProps): void {
    if (props.price !== undefined) {
      Vehicle.validatePrice(props.price);
      this.props.price = props.price;
    }
    if (props.year !== undefined) {
      Vehicle.validateYear(props.year);
      this.props.year = props.year;
    }
    if (props.brand !== undefined) this.props.brand = props.brand;
    if (props.model !== undefined) this.props.model = props.model;
    if (props.color !== undefined) this.props.color = props.color;

    this.props.updatedAt = new Date();
  }

  markAsSold(): void {
    if (this.props.status === VehicleStatus.SOLD) {
      throw new BusinessRuleViolationError('Vehicle is already sold');
    }
    this.props.status = VehicleStatus.SOLD;
    this.props.updatedAt = new Date();
  }

  private static validatePrice(price: number): void {
    if (price <= 0) {
      throw new InvalidInputError('Vehicle price must be greater than zero');
    }
  }

  private static validateYear(year: number): void {
    const nextYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < MIN_VALID_YEAR || year > nextYear) {
      throw new InvalidInputError(`Vehicle year must be between ${MIN_VALID_YEAR} and ${nextYear}`);
    }
  }

  get id(): string {
    return this.props.id;
  }

  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get year(): number {
    return this.props.year;
  }

  get color(): string {
    return this.props.color;
  }

  get price(): number {
    return this.props.price;
  }

  get status(): VehicleStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toProps(): VehicleProps {
    return { ...this.props };
  }
}
