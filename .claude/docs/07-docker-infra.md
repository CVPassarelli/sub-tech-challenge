# 07 — Docker and Infrastructure

## Arquivos necessários

- Dockerfile
- docker-compose.yml
- .dockerignore
- .env.example

## Serviços no Docker Compose

- api
- postgres
- keycloak

## Portas sugeridas

- API: 3000
- PostgreSQL: 5432
- Keycloak: 8080

## Variáveis de ambiente sugeridas

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vehicle_sales?schema=public
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_ISSUER_URL=http://localhost:8080/realms/vehicle-sales
KEYCLOAK_JWKS_URI=http://localhost:8080/realms/vehicle-sales/protocol/openid-connect/certs
KEYCLOAK_AUDIENCE=vehicle-sales-api
```

## Dockerfile esperado

Deve:

- Usar imagem Node LTS Alpine.
- Instalar dependências.
- Gerar Prisma Client.
- Buildar TypeScript.
- Rodar aplicação em modo produção.

## docker-compose esperado

Deve:

- Subir PostgreSQL com volume persistente.
- Subir Keycloak separado.
- Subir API dependente do banco.
- Expor as portas necessárias.
