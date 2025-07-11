# frontend/Dockerfile
# Etapa 1 – compilación
FROM node:20 AS builder
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend .
RUN npm run build           # salida en /frontend/dist

# Etapa 2 – Nginx estático
FROM nginx:1.27-alpine
COPY --from=builder /frontend/dist /usr/share/nginx/html
# Proxy /api → backend
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
