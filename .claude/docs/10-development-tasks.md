# 10 — Development Tasks for Claude Code

Execute em etapas pequenas e valide o projeto após cada etapa.

## Etapa 1 — Bootstrap

- Criar projeto NestJS com TypeScript.
- Configurar ESLint, Prettier e Jest.
- Criar estrutura de pastas.
- Criar health check.

## Etapa 2 — Infra local

- Criar Dockerfile.
- Criar docker-compose.yml com API, PostgreSQL e Keycloak.
- Criar .env.example.
- Garantir que `docker compose up` funcione.

## Etapa 3 — Banco

- Configurar Prisma.
- Criar models Vehicle e Sale.
- Criar migration inicial.
- Criar PrismaService.

## Etapa 4 — Vehicles

- Criar entidade/modelo de domínio.
- Criar DTOs.
- Criar repository interface.
- Criar PrismaVehicleRepository.
- Criar use cases.
- Criar controller.
- Criar testes.

## Etapa 5 — Auth

- Configurar validação JWT com Keycloak.
- Criar JwtAuthGuard.
- Criar CurrentUser decorator.
- Proteger endpoint de compra.

## Etapa 6 — Sales

- Criar domínio de venda.
- Criar use case de compra transacional.
- Criar repository.
- Criar controller.
- Criar testes.

## Etapa 7 — Docs

- Configurar Swagger.
- Atualizar README com:
  - visão geral
  - arquitetura
  - como rodar localmente
  - como configurar Keycloak
  - como testar
  - endpoints principais
  - fluxo de demonstração
  - CI/CD e deploy

## Etapa 8 — CI/CD

- Criar GitHub Actions de CI.
- Criar configuração de deploy automatizado conforme provedor escolhido.

## Etapa 9 — Validação final

Executar:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
docker compose up
```
