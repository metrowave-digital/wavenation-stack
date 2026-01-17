# ----------------------------------------
# Base Image
# ----------------------------------------
FROM node:20-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----------------------------------------
# Install deps
# ----------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ----------------------------------------
# Builder stage
# ----------------------------------------
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Install pnpm here again (important)
RUN corepack enable

# Build Next.js (standalone output)
RUN pnpm build

# ----------------------------------------
# Runner (production)
# ----------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what Next needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY package.json ./

EXPOSE 3000

CMD ["node", "server.js"]
