# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 13

[label Dockerfile]
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Bundle the application with tree-shaking
[highlight]
RUN npx esbuild --bundle --minify --platform=node --target=node16 --outfile=dist/bundle.js src/index.js
[/highlight]

FROM node:22-alpine
WORKDIR /app
# Only copy the bundled application
COPY --from=builder /app/dist/bundle.js ./index.js
EXPOSE 3000
CMD ["node", "index.js"]