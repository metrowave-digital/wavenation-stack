# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----------------------------------------
# Install CMS dependencies (LOCAL)
# ----------------------------------------
FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/cms ./apps/cms

WORKDIR /app/apps/cms

# 🔑 This creates apps/cms/node_modules (required)
RUN pnpm install --frozen-lockfile

# ----------------------------------------
# Build CMS
# ----------------------------------------
FROM base AS build

COPY . .
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules

WORKDIR /app/apps/cms

RUN pnpm build

# ----------------------------------------
# Runtime
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
