# ── Deps ───────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install

# ── Build ──────────────────────────────────────────────────
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Run ────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
