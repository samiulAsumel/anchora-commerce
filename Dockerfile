# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

# Build-time-only placeholders so env validation passes while Next.js
# collects page data; the real values are injected at container runtime.
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV JWT_SECRET="build-time-placeholder-secret-please-override"
ENV JWT_REFRESH_SECRET="build-time-placeholder-refresh-please-override"
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
# Next's standalone server binds to $HOSTNAME if set, and Docker auto-sets
# HOSTNAME to the container id — without this it binds off-loopback and the
# healthcheck (and anything else hitting localhost) can't reach it.
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/v1/health || exit 1

CMD ["node", "server.js"]
