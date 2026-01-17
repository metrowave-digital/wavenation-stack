# ----------------------------------------
# Base
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
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
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm --filter cms build

# ----------------------------------------
# Runtime
# ----------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/cms/.next/standalone ./
COPY --from=build /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=build /app/apps/cms/public ./apps/cms/public
COPY package.json ./

EXPOSE 3000
CMD ["node", "server.js"]
