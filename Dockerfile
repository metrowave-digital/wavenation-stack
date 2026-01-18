# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="/app/node_modules/.bin:$PNPM_HOME:$PATH"

RUN corepack enable

# ----------------------------------------
# Dependencies
# ----------------------------------------
FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps

RUN pnpm install --frozen-lockfile

# ----------------------------------------
# Build CMS
# ----------------------------------------
FROM base AS build

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY --from=deps /app/node_modules ./node_modules

# 🔑 RUN BUILD FROM ROOT, FILTERED
RUN pnpm --filter @wavenation/cms run build

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
