# Dependencies stage
FROM node:22-alpine AS deps
COPY package.json package-lock.json /app/
RUN cd /app && npm ci


# Build stage
FROM node:22-alpine AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN cd /app && npm run build

# Runtime stage
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
COPY --from=build /app/public /app/public
COPY --from=build /app/.next/standalone /app
COPY --from=build /app/.next/static /app/.next/static

EXPOSE 3000

CMD ["node", "/app/server.js"]