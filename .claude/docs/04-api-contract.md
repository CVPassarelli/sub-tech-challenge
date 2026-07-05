# 04 — API Contract

## Health

### GET /health

Retorna status da API.

## Vehicles

### POST /vehicles

Cria um veículo.

Body:

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "color": "Prata",
  "price": 95000
}
```

### PATCH /vehicles/:id

Edita dados de um veículo.

### GET /vehicles/:id

Busca veículo por id.

### GET /vehicles/available

Lista veículos disponíveis ordenados por preço crescente.

### GET /vehicles/sold

Lista veículos vendidos ordenados por preço crescente.

## Sales

### POST /sales

Requer autenticação Bearer JWT.

Body:

```json
{
  "vehicleId": "uuid-do-veiculo"
}
```

Resposta esperada:

```json
{
  "id": "uuid-da-venda",
  "vehicleId": "uuid-do-veiculo",
  "buyerExternalId": "keycloak-user-sub",
  "priceAtSale": 95000,
  "soldAt": "2026-07-05T00:00:00.000Z"
}
```

### GET /sales/:id

Busca venda por id.

## Erros esperados

- 400: payload inválido
- 401: usuário não autenticado
- 403: usuário sem permissão, se aplicável
- 404: recurso não encontrado
- 409: veículo já vendido
