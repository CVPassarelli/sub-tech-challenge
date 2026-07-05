# Skill — Database and Prisma

Use esta skill para modelagem e persistência.

## Diretrizes

- Use migrations.
- Use UUID para ids.
- Use Decimal para dinheiro.
- Não use float para preço.
- Crie índices para consultas frequentes.
- Use transações para compra de veículo.

## Checklist

- A venda congela o preço em `priceAtSale`?
- O veículo vendido recebe status SOLD?
- Existe restrição para evitar venda duplicada?
- A modelagem separa autenticação de transações?
