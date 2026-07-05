# 01 — Project Overview

## Contexto

API backend para uma empresa de revenda de veículos automotores. O frontend será integrado posteriormente por outro time.

## Funcionalidades principais

- Gerenciamento de veículos.
- Compra online de veículos por compradores cadastrados.
- Separação entre autenticação/clientes e dados transacionais.
- Listagens ordenadas por preço.

## Decisão técnica principal

A autenticação será feita com Keycloak em serviço separado, rodando via Docker Compose. A API principal apenas valida tokens JWT e registra o identificador externo do comprador nas vendas.

## Entregáveis do trabalho

- Repositório com código-fonte.
- README completo.
- Deploy automatizado.
- PDF com links do repositório e vídeo demonstrativo.
- Vídeo demonstrando infraestrutura e fluxo ponta a ponta.

## Fluxo fim a fim esperado

1. Subir infraestrutura com Docker Compose.
2. Criar/cadastrar comprador no Keycloak.
3. Obter token JWT.
4. Criar veículo disponível para venda.
5. Listar veículos disponíveis.
6. Comprar veículo usando token JWT.
7. Confirmar que veículo foi marcado como vendido.
8. Listar veículos vendidos.
