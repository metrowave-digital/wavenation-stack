# ======================================================
# Base
# ======================================================
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# ======================================================
# Dependencies
# ======================================================
FROM base AS deps

COPY package.json ./
RUN pnpm install

# ======================================================
# Build
# ======================================================
FROM deps AS build
COPY . .
RUN pnpm build

# ======================================================
# Runtime
# ======================================================
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000
CMD ["pnpm", "start"]
