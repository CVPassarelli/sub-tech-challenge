# Master Prompt para enviar ao Claude Code

Você é um engenheiro de software sênior especialista em Node.js, TypeScript, NestJS, PostgreSQL, Prisma, Docker, Keycloak, testes automatizados, arquitetura limpa e CI/CD.

Preciso que você desenvolva uma API backend completa para o Trabalho Substitutivo de Tech Challenge SOAT — PósTech — Fase 3.

Antes de escrever código, leia obrigatoriamente:

- `CLAUDE.md`
- `.claude/docs/01-project-overview.md`
- `.claude/docs/02-architecture.md`
- `.claude/docs/03-domain-model.md`
- `.claude/docs/04-api-contract.md`
- `.claude/docs/05-auth-keycloak.md`
- `.claude/docs/06-database-prisma.md`
- `.claude/docs/07-docker-infra.md`
- `.claude/docs/08-testing-strategy.md`
- `.claude/docs/09-cicd-deploy.md`
- `.claude/docs/10-development-tasks.md`
- arquivos em `.claude/skills`

Sua tarefa é criar o projeto completo em Node.js com TypeScript usando NestJS, PostgreSQL, Prisma, Keycloak, Docker e GitHub Actions.

Requisitos obrigatórios:

1. Criar API funcional para cadastro, edição e listagem de veículos.
2. Listar veículos disponíveis ordenados por preço crescente.
3. Listar veículos vendidos ordenados por preço crescente.
4. Permitir compra de veículo apenas por comprador autenticado.
5. Usar Keycloak separado da API para cadastro/autenticação de compradores.
6. Validar JWT na API.
7. Registrar venda de forma transacional.
8. Impedir venda duplicada do mesmo veículo.
9. Criar Dockerfile e docker-compose.yml para rodar API, PostgreSQL e Keycloak.
10. Criar Prisma schema e migrations.
11. Criar Swagger/OpenAPI.
12. Criar testes unitários e e2e dos fluxos principais.
13. Criar GitHub Actions para CI em Pull Requests.
14. Criar configuração/documentação de deploy automatizado.
15. Criar README.md completo explicando projeto, arquitetura, como rodar, como testar, como usar Keycloak, endpoints e fluxo de demonstração.

Trabalhe de forma incremental. Após cada etapa importante, garanta que o projeto continue buildando e que os testes façam sentido.

Não deixe regras de negócio dentro dos controllers. Use casos de uso, repositories e separação clara de camadas.

No final, me entregue um resumo do que foi criado, comandos para rodar localmente, comandos de teste e roteiro para gravar o vídeo demonstrativo do trabalho.
