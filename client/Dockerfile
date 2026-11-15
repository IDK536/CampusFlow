# Сборка статики
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# true — фронт работает сам по себе на mock-данных; false — ходит в backend через /api
ARG VITE_USE_MOCK=true
ENV VITE_USE_MOCK=$VITE_USE_MOCK
RUN npm run build

# Раздача через nginx + прокси /api на backend
FROM nginx:1.27-alpine
ENV API_UPSTREAM=http://backend:8080
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
