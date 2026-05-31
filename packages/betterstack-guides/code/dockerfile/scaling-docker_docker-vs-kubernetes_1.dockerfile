# Source: https://betterstack.com/community/guides/scaling-docker/docker-vs-kubernetes/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 1

[label Dockerfile]
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]