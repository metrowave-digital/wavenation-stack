# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----------------------------------------
# Install dependencies (WORKSPACE-AWARE)
# ----------------------------------------
FROM base AS deps

# Copy workspace manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps

# 🔑 IMPORTANT: install ONLY cms workspace deps
RUN pnpm install --filter ./apps/cms... --frozen-lockfile

# ----------------------------------------
# Build CMS
# ----------------------------------------
FROM base AS build
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

# ✅ Now `next` binary exists
RUN pnpm --filter ./apps/cms... build

# ----------------------------------------
# Runtime (standalone)
# ----------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/cms/.next/standalone ./
COPY --from=build /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=build /app/apps/cms/public ./apps/cms/public
COPY package.json ./

EXPOSE 3000
CMD ["node", "server.js"]
