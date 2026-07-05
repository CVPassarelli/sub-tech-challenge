# 02 — Architecture

## Estilo arquitetural

Use arquitetura limpa/camadas:

```txt
src/
  main.ts
  app.module.ts
  config/
  common/
  modules/
    vehicles/
      domain/
      application/
      infra/
      presentation/
    sales/
      domain/
      application/
      infra/
      presentation/
    auth/
      infra/
      presentation/
  infra/
    database/
```

## Responsabilidades

### presentation

- Controllers HTTP.
- DTOs.
- Swagger decorators.
- Guards.
- Pipes/validações.

### application

- Casos de uso.
- Orquestração das regras.
- Transações de aplicação.

### domain

- Entidades.
- Enums.
- Regras puras.
- Interfaces de repositórios.

### infra

- Prisma.
- Implementações de repositories.
- Integração com Keycloak/JWT.
- Configurações externas.

## Regras importantes

- Controller não deve ter regra de negócio.
- Use case não deve depender diretamente de HTTP.
- Domain não deve depender de NestJS, Prisma ou banco.
- Repositories devem esconder detalhes do Prisma.
