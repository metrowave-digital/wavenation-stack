# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_ENABLE_PREPARE_SCRIPTS=true

RUN corepack enable

# ----------------------------------------
# Dependencies
# ----------------------------------------
FROM base AS deps
ENV NODE_ENV=development

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps

# 🔑 APPROVE ALL BUILD SCRIPTS (CI-safe)
RUN pnpm install --frozen-lockfile --unsafe-perm

# ----------------------------------------
# Build CMS
# ----------------------------------------
FROM base AS build
ENV NODE_ENV=development

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY --from=deps /app/node_modules ./node_modules

RUN pnpm --filter @wavenation/cms... exec next build

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
