# Source: https://betterstack.com/community/guides/scaling-nodejs/nvm-alternatives-guide/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 20

[label Dockerfile.prod]
# Build stage
FROM node:16.13.0-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16.13.0-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

CMD ["npm", "run", "start:prod"]