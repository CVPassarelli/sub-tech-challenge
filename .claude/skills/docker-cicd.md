# Skill — Docker and CI/CD

Use esta skill para infraestrutura local e pipeline.

## Diretrizes

- Criar Dockerfile multi-stage se possível.
- Criar docker-compose com API, PostgreSQL e Keycloak.
- Criar .env.example sem secrets reais.
- Criar GitHub Actions para PR.
- Documentar deploy automatizado.

## Checklist

- `docker compose up` sobe a aplicação?
- Banco possui volume?
- Keycloak está separado?
- CI roda lint, test e build?
- README explica deploy?
