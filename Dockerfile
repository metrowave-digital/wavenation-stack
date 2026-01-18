# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="/app/node_modules/.bin:$PNPM_HOME:$PATH"

RUN corepack enable

# ----------------------------------------
# Dependencies (install as "dev" for build)
# ----------------------------------------
FROM base AS deps
ENV NODE_ENV=development

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps

# Install workspace deps (including apps/cms)
RUN pnpm install --frozen-lockfile

# Debug: prove Next is installed at root
RUN ls -la /app/node_modules/.bin | grep next

# ----------------------------------------
# Build CMS
# ----------------------------------------
FROM base AS build
ENV NODE_ENV=development

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY --from=deps /app/node_modules ./node_modules

# Build from workspace root with filter
RUN pnpm --filter @wavenation/cms... run build

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
