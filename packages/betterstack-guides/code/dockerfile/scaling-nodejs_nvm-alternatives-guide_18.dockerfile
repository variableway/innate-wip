# Source: https://betterstack.com/community/guides/scaling-nodejs/nvm-alternatives-guide/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 18

[label Dockerfile]
FROM node:16.13.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]