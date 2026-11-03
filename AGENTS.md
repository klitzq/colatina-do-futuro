<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Padrão do projeto Colatina do Futuro

- **Idioma:** português do Brasil em código, mensagens da API, comentários e respostas.
- **Arquitetura:** está descrita no `README.md` (seções Estrutura, Fluxo, Criando um módulo novo e Padrão de testes). Siga-a sempre.
  - Backend em `src/servidor`: route.ts → Controller → CasoDeUso → Service + Repository → Entidade.
  - Toda classe nova herda a base de `src/servidor/nucleo`. Não duplique o que a base já faz.
  - Um caso de uso por regra de negócio, sempre com `.spec.ts` ao lado, no padrão Dado/Quando/Então.
  - Os services não fazem I/O. Os controllers não têm regra de negócio.
  - Front: `_services/<modulo>.ts` (herdando `ServicoCrud` ou usando `api<T>`) e `_types/<modulo>.ts` (interface principal com `export default`).
- **Antes de terminar:** rode `pnpm test`, `pnpm typecheck` e `pnpm lint`.
- **Shell:** o terminal do usuário é o fish. Em comandos sugeridos, use aspas simples.
