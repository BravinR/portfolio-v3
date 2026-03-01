# Stage 1: Build the frontend
FROM node:25-alpine3.22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production server
FROM node:25-alpine3.22
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY posts ./posts
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./node_modules/.bin/tsx", "server.ts"]
