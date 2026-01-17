# ======================================================
# Base
# ======================================================
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# ======================================================
# Dependencies (monorepo-aware)
# ======================================================
FROM base AS deps

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy CMS package.json
COPY apps/cms/package.json apps/cms/package.json

# Copy shared packages (ONLY if CMS depends on them)
COPY packages packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# ======================================================
# Build
# ======================================================
FROM deps AS build

# Copy full repo
COPY . .

# Build ONLY the CMS
RUN pnpm --filter ./apps/cms... build

# ======================================================
# Runtime
# ======================================================
FROM base AS runner
ENV NODE_ENV=production

WORKDIR /app

# Copy built app + node_modules
COPY --from=build /app ./

# Move into CMS app
WORKDIR /app/apps/cms

# Render injects PORT automatically
EXPOSE 3000

CMD ["pnpm", "start"]
