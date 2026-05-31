# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 27

[label Dockerfile]
FROM node:22
# Bad practice - using cd commands
RUN cd /opt && mkdir app
RUN cd /opt/app && npm init -y
COPY . /opt/app/
RUN cd /opt/app && npm install
CMD cd /opt/app && npm start