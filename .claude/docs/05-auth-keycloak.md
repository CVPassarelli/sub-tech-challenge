# 05 — Auth with Keycloak

## Objetivo

Manter autenticação e dados de compradores separados da API transacional.

## Decisão

Usar Keycloak em container separado no Docker Compose.

## Requisitos

- Criar realm específico para o projeto.
- Criar client para a API/frontend.
- Permitir criação de usuário comprador.
- Gerar token JWT.
- API deve validar token JWT.
- API deve extrair `sub` do token e usar como `buyerExternalId`.

## Variáveis de ambiente sugeridas

```env
KEYCLOAK_ISSUER_URL=http://localhost:8080/realms/vehicle-sales
KEYCLOAK_JWKS_URI=http://localhost:8080/realms/vehicle-sales/protocol/openid-connect/certs
KEYCLOAK_AUDIENCE=vehicle-sales-api
```

## Implementação na API

Criar módulo `auth` com:

- JwtAuthGuard
- CurrentUser decorator
- JwtStrategy ou validação JWKS
- AuthenticatedUser interface

Exemplo de usuário autenticado:

```ts
export interface AuthenticatedUser {
  sub: string;
  email?: string;
  name?: string;
}
```

## Importante

A API principal não deve armazenar senha, hash de senha ou dados sensíveis de autenticação.
