# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

RUN corepack enable

# ----------------------------------------
# Dependencies
# ----------------------------------------
FROM base AS deps
ENV NODE_ENV=development

COPY .npmrc ./
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps

RUN pnpm install --frozen-lockfile

# ----------------------------------------
# Build CMS
# ----------------------------------------
FROM base AS build
ENV NODE_ENV=development

COPY .npmrc ./
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/apps/cms
RUN pnpm run build

# ----------------------------------------
# Runtime
# ----------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/cms/.next/standalone ./
COPY --from=build /app/apps/cms/.next/static ./.next/static
COPY --from=build /app/apps/cms/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
