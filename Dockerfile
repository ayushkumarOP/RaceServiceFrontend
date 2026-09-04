# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_ENV=production
ENV VITE_ENV=${VITE_ENV}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
