# Vehicle Sales API — Tech Challenge SOAT (PósTech) — Fase 3

API backend para uma plataforma de revenda de veículos automotores. Permite cadastrar e editar veículos, listar veículos disponíveis/vendidos ordenados por preço, e vender veículos para compradores autenticados, mantendo os dados de identidade dos compradores totalmente separados dos dados transacionais de venda.

## Sumário

- [Visão geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Como rodar localmente](#como-rodar-localmente)
- [Configurando o Keycloak (cadastro de compradores)](#configurando-o-keycloak-cadastro-de-compradores)
- [Endpoints principais](#endpoints-principais)
- [Fluxo de demonstração ponta a ponta](#fluxo-de-demonstração-ponta-a-ponta)
- [Como testar](#como-testar)
- [CI/CD e deploy](#cicd-e-deploy)

## Visão geral

O sistema é composto por dois serviços conceitualmente independentes:

1. **API transacional** (este repositório): cadastro/edição/listagem de veículos e registro de vendas.
2. **Serviço de identidade** (Keycloak, rodando em container separado): cadastro e autenticação dos compradores.

A API nunca armazena senha ou dado sensível de autenticação do comprador. Ela apenas valida o JWT emitido pelo Keycloak e usa o `sub` (identificador externo do usuário) como `buyerExternalId` ao registrar uma venda — por isso os dados de clientes ficam completamente apartados dos dados de venda.

### Regras de negócio implementadas

- Preço do veículo deve ser maior que zero.
- Ano do veículo deve ser válido (entre 1900 e o próximo ano civil).
- Veículo novo é sempre criado com status `AVAILABLE`.
- Veículo `SOLD` não aparece na listagem de disponíveis e não pode ser vendido novamente (retorna `409 Conflict`).
- A compra só é permitida para usuários autenticados via JWT do Keycloak (retorna `401` sem token).
- A compra é transacional: a criação da venda e a baixa do veículo (`AVAILABLE` → `SOLD`) ocorrem na mesma transação de banco.
- O preço é congelado em `priceAtSale` no momento da compra (alterações futuras no preço do veículo não afetam vendas já realizadas).

## Arquitetura

Arquitetura em camadas (clean architecture), separada por módulo de negócio:

```txt
src/
  main.ts                    # bootstrap, Swagger, pipes e filtros globais
  app.module.ts
  config/                    # configuração tipada (env vars)
  common/
    exceptions/               # erros de domínio (EntityNotFoundError, BusinessRuleViolationError, InvalidInputError)
    filters/                   # tratamento padronizado de erros HTTP
  infra/
    database/                  # PrismaService/PrismaModule (compartilhado)
  modules/
    vehicles/
      domain/                  # entidade Vehicle + regras de negócio + contrato de repositório
      application/use-cases/   # criar, editar, buscar, listar disponíveis, listar vendidos
      infra/                    # PrismaVehicleRepository
      presentation/             # controller, DTOs (class-validator + swagger)
    sales/
      domain/                  # entidade Sale + contrato de repositório + porta de transação de compra
      application/use-cases/   # comprar veículo, buscar venda
      infra/                    # PrismaSaleRepository + transação de compra (Prisma $transaction)
      presentation/             # controller, DTOs
    auth/
      infra/                    # JwtStrategy (valida JWT via JWKS do Keycloak)
      presentation/             # JwtAuthGuard, CurrentUser decorator, AuthenticatedUser
    health/
```

Regras de dependência:

- `domain` não depende de NestJS, Prisma ou HTTP — apenas regras puras.
- `application` (use cases) depende apenas de interfaces de `domain`, nunca de Prisma diretamente.
- `infra` implementa as interfaces de `domain` usando Prisma.
- `presentation` (controllers/DTOs) é a única camada que conhece HTTP; não contém regra de negócio.

Como a compra envolve duas entidades (`Vehicle` e `Sale`) que precisam mudar de forma atômica, essa operação é modelada como uma porta de domínio (`VehiclePurchaseTransaction`) implementada na camada de infraestrutura com `prisma.$transaction`, reaproveitando a regra `Vehicle.markAsSold()` do domínio dentro da transação.

## Stack técnica

- Node.js 20 + TypeScript (strict)
- NestJS 11
- PostgreSQL 16 + Prisma ORM 6
- Keycloak 26 (serviço de identidade separado, via Docker)
- Passport + `passport-jwt` + `jwks-rsa` (validação de JWT via JWKS, sem dependência de biblioteca de admin do Keycloak)
- Swagger / OpenAPI (`@nestjs/swagger`)
- Jest + Supertest (testes unitários e e2e)
- Docker + Docker Compose
- GitHub Actions (CI) + Render (deploy automatizado)

## Como rodar localmente

Pré-requisitos: Docker e Docker Compose.

```bash
docker compose up --build
```

Isso sobe três serviços:

| Serviço  | URL                       | Descrição                              |
|----------|---------------------------|-----------------------------------------|
| api      | http://localhost:3000     | API principal (aplica migrations no start) |
| postgres | localhost:5432            | Banco de dados transacional             |
| keycloak | http://localhost:8080     | Serviço de identidade (realm `vehicle-sales` importado automaticamente) |

Após subir, confirme:

- `GET http://localhost:3000/health` → `{"status":"ok", ...}`
- Swagger em **http://localhost:3000/docs**
- Console admin do Keycloak em **http://localhost:8080** (usuário `admin`, senha `admin`)

> O realm `vehicle-sales` e o client `vehicle-sales-api` já são criados automaticamente na subida do Keycloak (`keycloak/realm-export.json`), não é necessário nenhum passo manual de configuração do realm.

### Rodando sem Docker (desenvolvimento)

```bash
npm install
cp .env.example .env
# ajuste o .env se necessário (ex.: se Postgres/Keycloak rodarem em outra porta)
npx prisma migrate deploy
npm run start:dev
```

Nesse caso, o Postgres e o Keycloak ainda precisam estar rodando (pode subir só eles com `docker compose up postgres keycloak`).

## Configurando o Keycloak (cadastro de compradores)

O cadastro do comprador é feito **inteiramente dentro do Keycloak**, nunca na API principal. Existem duas formas de cadastrar um comprador:

### Opção A — Autoatendimento (tela de registro do Keycloak)

O realm já está com `registrationAllowed: true`. Acesse:

```
http://localhost:8080/realms/vehicle-sales/protocol/openid-connect/auth?client_id=vehicle-sales-api&response_type=code&redirect_uri=http://localhost:8080/realms/vehicle-sales/account&scope=openid
```

e clique em "Register" para criar um comprador via formulário.

### Opção B — Via linha de comando (mais rápido para testes/demonstração)

```bash
# 1. Obter token de administrador do Keycloak
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=admin-cli&username=admin&password=admin" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).access_token))")

# 2. Cadastrar o comprador (firstName/lastName são obrigatórios pelo User Profile do Keycloak)
curl -X POST http://localhost:8080/admin/realms/vehicle-sales/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "buyer1",
    "email": "buyer1@example.com",
    "firstName": "Buyer",
    "lastName": "One",
    "enabled": true,
    "emailVerified": true,
    "credentials": [{ "type": "password", "value": "buyer123", "temporary": false }]
  }'

# 3. Obter o token JWT do comprador recém-cadastrado
BUYER_TOKEN=$(curl -s -X POST http://localhost:8080/realms/vehicle-sales/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=vehicle-sales-api&username=buyer1&password=buyer123" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).access_token))")

echo $BUYER_TOKEN
```

Esse `BUYER_TOKEN` é usado como `Authorization: Bearer <token>` na compra do veículo (`POST /sales`). A API valida a assinatura do token contra o JWKS do Keycloak e usa o `sub` do token como `buyerExternalId`.

## Endpoints principais

Documentação interativa completa em `/docs` (Swagger). Resumo:

| Método | Rota                 | Auth | Descrição                                             |
|--------|----------------------|------|--------------------------------------------------------|
| GET    | `/health`            | não  | Status da API                                          |
| POST   | `/vehicles`          | não  | Cadastra um veículo                                    |
| PATCH  | `/vehicles/:id`      | não  | Edita dados de um veículo                              |
| GET    | `/vehicles/:id`      | não  | Busca veículo por id                                   |
| GET    | `/vehicles/available`| não  | Lista veículos disponíveis, ordenados por preço crescente |
| GET    | `/vehicles/sold`     | não  | Lista veículos vendidos, ordenados por preço crescente |
| POST   | `/sales`             | **sim** (Bearer JWT) | Compra um veículo disponível                |
| GET    | `/sales/:id`         | não  | Busca venda por id                                     |

Códigos de erro padronizados: `400` (payload inválido), `401` (sem autenticação), `404` (recurso não encontrado), `409` (veículo já vendido).

## Fluxo de demonstração ponta a ponta

Com a stack rodando (`docker compose up --build`) e um comprador já cadastrado (seção anterior):

```bash
# 1. Criar veículo
curl -X POST http://localhost:3000/vehicles \
  -H "Content-Type: application/json" \
  -d '{"brand":"Toyota","model":"Corolla","year":2022,"color":"Prata","price":95000}'
# guarde o "id" retornado em VEHICLE_ID

# 2. Listar veículos disponíveis (ordenado por preço)
curl http://localhost:3000/vehicles/available

# 3. Comprar o veículo autenticado com o token do comprador
curl -X POST http://localhost:3000/sales \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"vehicleId\":\"$VEHICLE_ID\"}"

# 4. Confirmar que o veículo virou SOLD e some da listagem de disponíveis
curl http://localhost:3000/vehicles/available

# 5. Listar veículos vendidos
curl http://localhost:3000/vehicles/sold

# 6. Tentar comprar de novo (deve retornar 409)
curl -i -X POST http://localhost:3000/sales \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"vehicleId\":\"$VEHICLE_ID\"}"

# 7. Tentar comprar sem token (deve retornar 401)
curl -i -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d "{\"vehicleId\":\"$VEHICLE_ID\"}"
```

Esse é exatamente o roteiro usado no vídeo de demonstração da solução.

## Como testar

```bash
npm test          # testes unitários (entidades e use cases, com repositórios mockados)
npm run test:e2e  # teste e2e do fluxo completo de compra
```

O teste e2e (`test/vehicles-sales.e2e-spec.ts`) sobe automaticamente um container Postgres descartável via Docker (não precisa da stack do `docker compose` rodando), aplica as migrations do Prisma e testa o fluxo HTTP completo: criar veículo → listar disponíveis → tentar comprar sem token (401) → comprar autenticado → confirmar `SOLD` → listar vendidos → confirmar sumiço da listagem de disponíveis → tentar comprar de novo (409). A autenticação real do Keycloak é substituída por um guard fake nesse teste (via `overrideGuard`), mantendo o teste rápido e determinístico; o fluxo de autenticação real é validado manualmente conforme a seção anterior e no vídeo de demonstração.

Requisito: Docker precisa estar disponível para rodar o teste e2e (ele cria e remove o container automaticamente).

## CI/CD e deploy

- **CI** (`.github/workflows/ci.yml`): roda em toda alteração enviada por Pull Request (ou push) para `main` — instala dependências, gera o Prisma Client, roda lint, build, testes unitários e testes e2e.
- **Deploy** (`.github/workflows/deploy.yml` + `render.yaml`): após o CI concluir com sucesso na branch `main`, o workflow de deploy dispara um *deploy hook* do [Render](https://render.com), que reconstrói e publica a API automaticamente.
  - `render.yaml` é um Blueprint do Render que provisiona o serviço web (a partir do `Dockerfile` deste repositório) e um banco PostgreSQL gerenciado.
  - Para ativar: crie uma conta no Render, use "New Blueprint" apontando para este repositório, gere um *Deploy Hook* para o serviço criado e cadastre a URL no secret `RENDER_DEPLOY_HOOK_URL` do repositório GitHub.
  - As variáveis `KEYCLOAK_ISSUER_URL`, `KEYCLOAK_JWKS_URI` e `KEYCLOAK_AUDIENCE` devem ser configuradas manualmente no serviço do Render, apontando para a instância do Keycloak usada em produção (pode ser outro serviço Render, ou qualquer Keycloak acessível publicamente).

Toda alteração no projeto segue o fluxo: branch de feature → Pull Request → CI executando lint/testes/build → merge em `main` → deploy automatizado.
