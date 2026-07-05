# Skill — Auth and Keycloak

Use esta skill para autenticação/autorização.

## Diretrizes

- Keycloak deve ser serviço separado.
- API deve validar JWT.
- API deve usar `sub` como identificador externo do comprador.
- API não deve armazenar senha.
- Endpoints de compra devem exigir Bearer Token.

## Checklist

- Endpoint de venda está protegido?
- Token inválido retorna 401?
- `buyerExternalId` vem do JWT?
- README explica como obter token?
