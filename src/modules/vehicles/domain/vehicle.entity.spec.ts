import {
  BusinessRuleViolationError,
  InvalidInputError,
} from '../../../common/exceptions/domain-error';
import { VehicleStatus } from './vehicle-status.enum';
import { Vehicle } from './vehicle.entity';

const validProps = {
  brand: 'Toyota',
  model: 'Corolla',
  year: 2022,
  color: 'Prata',
  price: 95000,
};

describe('Vehicle', () => {
  it('creates a vehicle as AVAILABLE', () => {
    const vehicle = Vehicle.create(validProps);

    expect(vehicle.status).toBe(VehicleStatus.AVAILABLE);
    expect(vehicle.brand).toBe('Toyota');
    expect(vehicle.id).toBeDefined();
  });

  it('rejects price less than or equal to zero', () => {
    expect(() => Vehicle.create({ ...validProps, price: 0 })).toThrow(InvalidInputError);
    expect(() => Vehicle.create({ ...validProps, price: -10 })).toThrow(InvalidInputError);
  });

  it('rejects invalid year', () => {
    expect(() => Vehicle.create({ ...validProps, year: 1899 })).toThrow(InvalidInputError);
    expect(() => Vehicle.create({ ...validProps, year: 3000 })).toThrow(InvalidInputError);
  });

  it('updates mutable fields', () => {
    const vehicle = Vehicle.create(validProps);
    vehicle.update({ price: 100000, color: 'Preto' });

    expect(vehicle.price).toBe(100000);
    expect(vehicle.color).toBe('Preto');
  });

  it('rejects update with invalid price', () => {
    const vehicle = Vehicle.create(validProps);
    expect(() => vehicle.update({ price: -1 })).toThrow(InvalidInputError);
  });

  it('marks vehicle as SOLD', () => {
    const vehicle = Vehicle.create(validProps);
    vehicle.markAsSold();

    expect(vehicle.status).toBe(VehicleStatus.SOLD);
  });

  it('does not allow selling a vehicle twice', () => {
    const vehicle = Vehicle.create(validProps);
    vehicle.markAsSold();

    expect(() => vehicle.markAsSold()).toThrow(BusinessRuleViolationError);
  });
});
