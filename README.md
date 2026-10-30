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
- [Prisma 7](https://www.prisma.io) com driver adapter `@prisma/adapter-pg`
- [Neon](https://neon.tech) (Postgres serverless) como banco de dados, local e em produção
- [Cloudinary](https://cloudinary.com) para armazenamento das fotos em produção
- [iron-session](https://github.com/vvo/iron-session) para a sessão do admin (senha única)
- [zod](https://zod.dev) para validação dos formulários
- Tailwind CSS 4

## Rodando localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. O banco de dados é o Neon Postgres do projeto (ligado via `.neon` /
   `neon.ts`, branch `production`). Para puxar as variáveis de ambiente
   (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) para o seu `.env`:

   ```bash
   neon login
   neon env pull
   ```

   Depois, defina `ADMIN_PASSWORD` (a senha que você vai usar para entrar em
   `/admin/login`) e mantenha o `SESSION_SECRET` gerado (ou gere o seu com o
   comando que está nos comentários do `.env.example`). Deixando as
   variáveis `CLOUDINARY_*` em branco, as fotos enviadas nos formulários são
   salvas localmente em `public/uploads` — ótimo para testar, mas **não
   funciona em produção na Vercel** (veja a seção de deploy).

   > Todo mundo que rodar o projeto localmente está apontando para a mesma
   > branch `production` do Neon. Para trabalhar isolado, crie uma branch de
   > desenvolvimento com `neon checkout dev --create` e rode `neon env pull`
   > de novo.

3. Se for a primeira vez (banco ainda sem tabelas) ou depois de alterar
   `prisma/schema.prisma`, rode as migrações:

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

O banco (Neon Postgres) já está pronto para produção — é o mesmo usado em
desenvolvimento. `DATABASE_URL` aponta para a conexão *pooled* (usada pelo
app via o driver adapter em `src/lib/prisma.ts`); `DATABASE_URL_UNPOOLED` é a
conexão direta, usada só para migrações (`prisma.config.ts`).

1. Crie uma conta gratuita no [Cloudinary](https://cloudinary.com) e copie
   `Cloud name`, `API Key` e `API Secret` do painel.
2. Na Vercel, configure as variáveis de ambiente do projeto com os mesmos
   valores do seu `.env`: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`,
   `ADMIN_PASSWORD`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. Faça o deploy normalmente (`vercel` ou conectando o repositório Git).
4. Se o schema mudar depois do primeiro deploy, rode `npx prisma migrate dev`
   localmente (ele usa a conexão direta do Neon) antes de subir o código —
   as migrações ficam versionadas em `prisma/migrations/` e sobem junto no
   `git push`.

## Estrutura

```
prisma/schema.prisma        Modelos de dados (News, Source, EditSuggestion)
src/app/                    Páginas (App Router) e Server Actions (src/app/actions)
src/components/             Formulários e componentes de UI
src/lib/                    Prisma client, sessão do admin, upload de imagem, validação
```
