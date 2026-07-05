# 08 — Testing Strategy

## Tipos de teste

### Unitários

Testar:

- regras de veículo
- use cases de criação/edição/listagem
- use case de compra
- validação de veículo já vendido

### Integração / e2e

Testar fluxo HTTP:

1. criar veículo
2. listar disponíveis
3. comprar veículo autenticado
4. confirmar veículo vendido
5. listar vendidos
6. tentar comprar novamente e receber 409

## Ferramentas

- Jest
- Supertest
- Testcontainers ou banco de teste via Docker Compose

## Critérios mínimos

- Testes principais devem rodar com `npm test`.
- Testes e2e devem rodar com `npm run test:e2e`.
- CI deve executar testes em Pull Request.
