# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 25

[label Dockerfile]
FROM nginx:alpine
COPY app/ /usr/share/nginx/html
# Implicitly runs as root
CMD ["nginx", "-g", "daemon off;"]