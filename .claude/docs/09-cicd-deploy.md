# 09 — CI/CD and Deploy

## Requisito do trabalho

Todas as mudanças devem ser feitas com práticas de CI/CD e Pull Requests.

## GitHub Actions mínimo

Criar workflow em `.github/workflows/ci.yml` para rodar em PR:

- checkout
- setup Node
- instalar dependências
- rodar lint
- rodar testes
- rodar build

## Deploy automatizado

Escolha uma opção simples e documente no README:

- Render
- Railway
- Fly.io
- AWS App Runner
- VPS com Docker

Para o trabalho, o importante é existir configuração clara de deploy automatizado.

## Sugestão

Usar Render ou Railway pela simplicidade acadêmica.

Criar também `.github/workflows/deploy.yml` se o provedor escolhido permitir deploy por GitHub Actions.

## Branching

- `main`: produção
- `develop`: desenvolvimento, opcional
- feature branches: `feature/nome-da-feature`
- Toda alteração deve ir por Pull Request.
