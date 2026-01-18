# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# ----------------------------------------
# Dependencies (CMS ONLY)
# ----------------------------------------
FROM base AS deps

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/cms/package.json ./apps/cms/package.json

# ⬇️ THIS IS THE CRITICAL LINE ⬇️
RUN pnpm install --filter ./apps/cms... --frozen-lockfile

# ----------------------------------------
# Build
# ----------------------------------------
FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules

COPY . .

WORKDIR /app/apps/cms

RUN pnpm build

# ----------------------------------------
# Runtime
# ----------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=build /app/apps/cms ./

EXPOSE 3000
CMD ["node", "server.js"]
