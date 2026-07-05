# 03 — Domain Model

## Vehicle

Campos:

- id: UUID
- brand: string
- model: string
- year: number
- color: string
- price: Decimal
- status: AVAILABLE | SOLD
- createdAt: Date
- updatedAt: Date

Regras:

- price > 0
- year deve ser válido
- status inicial deve ser AVAILABLE
- veículo SOLD não pode ser comprado novamente

## Sale

Campos:

- id: UUID
- vehicleId: UUID
- buyerExternalId: string
- priceAtSale: Decimal
- soldAt: Date
- createdAt: Date

Regras:

- sale deve estar vinculada a um veículo existente
- buyerExternalId vem do token JWT do Keycloak
- priceAtSale deve ser o preço do veículo no momento da compra
- compra deve ocorrer em transação

## Enums

```ts
export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}
```
