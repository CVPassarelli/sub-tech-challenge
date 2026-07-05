# CLAUDE.md — Tech Challenge SOAT Fase 3

Você é um engenheiro de software sênior especialista em Node.js, TypeScript, arquitetura limpa, APIs REST, banco de dados relacional, autenticação/autorização e CI/CD.

Seu objetivo é desenvolver uma API backend completa para uma plataforma de revenda de veículos automotores, conforme os requisitos do trabalho substitutivo de Tech Challenge SOAT — PósTech — Fase 3.

## Objetivo do produto

Criar uma API que permita:

- Cadastrar veículos para venda.
- Editar dados de veículos.
- Listar veículos disponíveis para venda, ordenados por preço do menor para o maior.
- Listar veículos vendidos, ordenados por preço do menor para o maior.
- Cadastrar compradores em um serviço de identidade separado.
- Permitir que apenas compradores cadastrados/autenticados possam comprar veículos.
- Registrar vendas de veículos de forma transacional.
- Manter dados de clientes separados dos dados transacionais de venda.

## Stack obrigatória recomendada

Use preferencialmente:

- Node.js com TypeScript.
- Fastify ou NestJS. Preferência: NestJS, por organização, DI, testes e escalabilidade.
- PostgreSQL como banco principal da aplicação.
- Prisma ORM.
- Keycloak como serviço separado de autenticação/autorização local.
- Docker e Docker Compose para subir API, banco e Keycloak.
- Jest para testes unitários e e2e.
- Swagger/OpenAPI para documentação da API.
- GitHub Actions para CI/CD.

## Arquitetura esperada

Use arquitetura limpa ou arquitetura em camadas bem separadas:

- `domain`: regras de negócio, entidades e contratos.
- `application`: casos de uso.
- `infra`: banco, ORM, integrações externas e autenticação.
- `presentation`: controllers, DTOs, validações e documentação HTTP.
- `config`: variáveis de ambiente, providers e inicialização.

Não misture regra de negócio diretamente em controllers.
Não acesse Prisma diretamente a partir de controllers.
Não deixe lógica crítica apenas no banco.

## Requisitos funcionais

### Veículos

Cada veículo deve conter, no mínimo:

- id
- marca
- modelo
- ano
- cor
- preço
- status: AVAILABLE ou SOLD
- createdAt
- updatedAt

Funcionalidades:

- Criar veículo.
- Editar veículo.
- Buscar veículo por id.
- Listar veículos disponíveis ordenados por preço crescente.
- Listar veículos vendidos ordenados por preço crescente.

Regras:

- Um veículo vendido não pode ser vendido novamente.
- Um veículo vendido não deve aparecer na listagem de disponíveis.
- Não permitir preço menor ou igual a zero.
- Não permitir ano inválido.

### Compradores / Autenticação

O serviço de compradores/autenticação deve estar apartado da aplicação principal.

Use Keycloak via Docker Compose como serviço separado.

A API principal deve:

- Validar JWT emitido pelo Keycloak.
- Extrair o `sub` do comprador autenticado.
- Usar esse identificador externo como `buyerExternalId` nas vendas.
- Não armazenar senha de comprador no banco transacional.

### Vendas

Cada venda deve conter, no mínimo:

- id
- vehicleId
- buyerExternalId
- priceAtSale
- soldAt
- createdAt

Funcionalidades:

- Comprar veículo autenticado.
- Consultar venda por id.
- Listar veículos vendidos por preço crescente.

Regras:

- A compra deve ser transacional.
- Ao comprar, o veículo deve mudar para SOLD.
- O preço da venda deve ser congelado no momento da compra em `priceAtSale`.
- Não permitir compra de veículo já vendido.
- Não permitir compra sem autenticação.

## Requisitos não funcionais

- API documentada com Swagger.
- Projeto executável localmente com Docker Compose.
- Banco com migrations.
- Validação de entrada em DTOs.
- Tratamento padronizado de erros.
- Logs básicos.
- Testes unitários e e2e para fluxos principais.
- CI rodando lint, build e testes em Pull Requests.
- Deploy automatizado configurado.

## Estrutura sugerida

Consulte os arquivos em `.claude/docs` antes de começar:

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

## Ordem de execução esperada

1. Criar projeto Node.js com TypeScript e NestJS.
2. Configurar ESLint, Prettier, Jest e ambiente.
3. Criar Dockerfile e docker-compose com API, PostgreSQL e Keycloak.
4. Configurar Prisma e migrations.
5. Implementar domínio de veículos.
6. Implementar autenticação via Keycloak/JWT.
7. Implementar domínio de vendas.
8. Criar Swagger.
9. Criar testes unitários e e2e.
10. Criar GitHub Actions para CI.
11. Criar configuração de deploy automatizado.
12. Atualizar README.md com instruções completas.

## Critérios de aceite

A solução só estará pronta quando:

- `docker compose up` subir todos os serviços necessários.
- A API estiver acessível localmente.
- Swagger estiver disponível.
- For possível cadastrar comprador no Keycloak.
- For possível obter token JWT.
- For possível criar veículo.
- For possível listar veículos disponíveis.
- For possível comprar veículo autenticado.
- O veículo comprado mudar para vendido.
- O veículo vendido aparecer na listagem de vendidos.
- Testes principais passarem.
- README explicar como rodar, testar e demonstrar o fluxo fim a fim.

## Padrões de código

- Use TypeScript estrito.
- Evite `any`.
- Use nomes claros e consistentes.
- Controllers devem ser finos.
- Services/use cases devem concentrar regras de negócio.
- Repositories devem isolar acesso ao banco.
- DTOs devem validar entrada.
- Erros devem ser tratados com exceptions específicas.
- Não commitar secrets.
- Use `.env.example`.

## Importante

Sempre que gerar código, mantenha o projeto funcional e incremental. Após cada grande etapa, garanta que build, lint e testes continuem funcionando.
