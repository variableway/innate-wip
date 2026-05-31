# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 3

[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]