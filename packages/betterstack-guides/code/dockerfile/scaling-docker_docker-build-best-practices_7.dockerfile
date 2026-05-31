# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 7

[label Dockerfile]
FROM node:22.1.0@sha256:12a331df1e31e40b2f37d2524037973908895fb766b8bce742cdf8b1216e5ac2
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]