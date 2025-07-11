# ───────────── Etapa 1: build Vite ─────────────
FROM node:20 AS builder
WORKDIR /frontend

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build          # genera /frontend/dist

# ───────────── Etapa 2: Nginx ─────────────
FROM nginx:1.27-alpine

# Copia estáticos compilados
COPY --from=builder /frontend/dist /usr/share/nginx/html

# Proxy /api → backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
