# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 0

[label Dockerfile]
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]