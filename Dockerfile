# --- STAGE 1: Build Stage ---
FROM node:25 AS builder
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# --- STAGE 2: Production Stage ---
FROM node:25-slim
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER node

EXPOSE 3000
CMD ["node", "server.js"]