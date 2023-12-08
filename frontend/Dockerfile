FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build \
    && rm -rf ./src \
    && rm -rf ./node_modules

FROM nginx:latest
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
