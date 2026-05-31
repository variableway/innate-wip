# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 28

[label Dockerfile]
FROM node:22
# Good practice - using WORKDIR
WORKDIR /opt/app
RUN npm init -y
COPY . .
RUN npm install
CMD ["npm", "start"]