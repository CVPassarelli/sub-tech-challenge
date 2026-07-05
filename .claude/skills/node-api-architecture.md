# Skill — Node API Architecture

Use esta skill quando criar ou alterar estrutura backend Node.js.

## Diretrizes

- Preferir NestJS com TypeScript.
- Separar controllers, use cases, repositories e domínio.
- Controllers não devem conter regra de negócio.
- Use cases devem ser testáveis sem HTTP.
- Infra deve conter detalhes de banco, Prisma e integrações.
- Domain deve ser independente de frameworks.

## Checklist

- Existe separação clara de responsabilidades?
- Os nomes dos módulos representam negócio?
- DTOs validam entrada?
- Erros são padronizados?
- Há testes para regras críticas?
