# Base stage
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web-marketing/package.json ./apps/web-marketing/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/web-marketing
EXPOSE 3000
CMD ["pnpm", "dev"]

# Build stage
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
WORKDIR /app

# Build shared packages
RUN pnpm --filter @petra/types build
RUN pnpm --filter @petra/utils build
RUN pnpm --filter @chakra-ui/react build
RUN pnpm --filter @petra/api-client build

# Build web-marketing
WORKDIR /app/apps/web-marketing
RUN pnpm build

# Production stage
FROM node:20-alpine AS production
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/web-marketing/package.json ./apps/web-marketing/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/config/package.json ./packages/config/

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=build /app/apps/web-marketing/.next ./apps/web-marketing/.next
COPY --from=build /app/apps/web-marketing/public ./apps/web-marketing/public
COPY --from=build /app/packages ./packages

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

WORKDIR /app/apps/web-marketing
CMD ["pnpm", "start"]

