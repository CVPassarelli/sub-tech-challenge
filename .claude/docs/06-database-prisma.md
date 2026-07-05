# 06 — Database and Prisma

## Banco

Use PostgreSQL.

## ORM

Use Prisma.

## Schema sugerido

```prisma
enum VehicleStatus {
  AVAILABLE
  SOLD
}

model Vehicle {
  id        String        @id @default(uuid())
  brand     String
  model     String
  year      Int
  color     String
  price     Decimal       @db.Decimal(12, 2)
  status    VehicleStatus @default(AVAILABLE)
  sale      Sale?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Sale {
  id              String   @id @default(uuid())
  vehicleId       String   @unique
  vehicle         Vehicle  @relation(fields: [vehicleId], references: [id])
  buyerExternalId String
  priceAtSale     Decimal  @db.Decimal(12, 2)
  soldAt          DateTime @default(now())
  createdAt       DateTime @default(now())

  @@index([buyerExternalId])
}
```

## Transação de compra

A compra deve:

1. Buscar veículo.
2. Validar se está AVAILABLE.
3. Criar venda com preço atual.
4. Atualizar veículo para SOLD.
5. Executar tudo em transação.

## Comandos esperados

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```
