# Semana da Violência Política

Site colaborativo para divulgar notícias sobre violência política, organizadas
em três listas — **Mortes**, **Agressões** e **Intimidações e Destruições** —
cada uma com seu contador de notícias publicadas.

Qualquer pessoa pode enviar uma notícia (foto, texto, links de fontes e,
opcionalmente, um link de doação) ou sugerir a edição de uma notícia já
publicada. Todo conteúdo enviado fica pendente até ser aprovado ou rejeitado
por um administrador em `/admin`.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)
- [Prisma 7](https://www.prisma.io) com SQLite em desenvolvimento
- [Cloudinary](https://cloudinary.com) para armazenamento das fotos em produção
- [iron-session](https://github.com/vvo/iron-session) para a sessão do admin (senha única)
- [zod](https://zod.dev) para validação dos formulários
- Tailwind CSS 4

## Rodando localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e ajuste os valores:

   ```bash
   cp .env.example .env
   ```

   Em desenvolvimento, só é obrigatório definir `ADMIN_PASSWORD` (a senha que
   você vai usar para entrar em `/admin/login`) e manter o `SESSION_SECRET`
   gerado (ou gerar o seu com o comando que está nos comentários do arquivo).
   Deixando as variáveis `CLOUDINARY_*` em branco, as fotos enviadas nos
   formulários são salvas localmente em `public/uploads` — ótimo para testar,
   mas **não funciona em produção na Vercel** (veja a seção de deploy).

3. Rode as migrações do banco local (SQLite):

   ```bash
   npx prisma migrate dev
   ```

4. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000). Para entrar como
   administrador, acesse `/admin/login` e use a senha definida em
   `ADMIN_PASSWORD`.

## Fluxo de moderação

- `POST /enviar` cria uma notícia com status `PENDING` — ela só aparece no
  site depois de aprovada em `/admin`.
- Em cada notícia publicada, o link "Sugerir uma correção ou edição" leva a
  um formulário pré-preenchido; o envio cria uma `EditSuggestion` pendente,
  também revisada em `/admin`, que mostra um comparativo (antes/depois) de
  cada campo alterado.
- Aprovar uma sugestão de edição substitui os campos alterados na notícia
  original; rejeitar apenas descarta a sugestão.

## Publicando em produção (Vercel)

O projeto está pronto para rodar localmente com SQLite, mas **SQLite não
funciona na Vercel** (o sistema de arquivos é somente leitura/efêmero em
funções serverless). Antes de publicar, troque o banco para Postgres:

1. Crie um banco Postgres gratuito, por exemplo no [Neon](https://neon.tech)
   ou no [Vercel Postgres](https://vercel.com/storage/postgres).
2. Em `prisma/schema.prisma`, troque o provider:

   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

3. Instale o driver adapter do Postgres e remova o do SQLite:

   ```bash
   npm install @prisma/adapter-pg pg
   npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3
   ```

4. Em `src/lib/prisma.ts`, troque o adapter do SQLite pelo do Postgres:

   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   // ...
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
   ```

5. Rode `npx prisma migrate dev` localmente (apontando `DATABASE_URL` para o
   Postgres) para criar as tabelas, depois `npx prisma generate`.
6. Crie uma conta gratuita no [Cloudinary](https://cloudinary.com) e copie
   `Cloud name`, `API Key` e `API Secret` do painel.
7. Na Vercel, configure as variáveis de ambiente do projeto:
   `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
8. Faça o deploy normalmente (`vercel` ou conectando o repositório Git).

## Estrutura

```
prisma/schema.prisma        Modelos de dados (News, Source, EditSuggestion)
src/app/                    Páginas (App Router) e Server Actions (src/app/actions)
src/components/             Formulários e componentes de UI
src/lib/                    Prisma client, sessão do admin, upload de imagem, validação
```
