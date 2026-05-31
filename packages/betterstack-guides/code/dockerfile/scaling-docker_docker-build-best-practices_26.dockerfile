# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 26

[label Dockerfile]
FROM nginx:alpine
# Create a non-root user
RUN addgroup -g 1000 appgroup && \
   adduser -u 1000 -G appgroup -h /home/appuser -D appuser

# Configure application
COPY --chown=appuser:appgroup app/ /usr/share/nginx/html

# For services that need to bind to privileged ports,
# start as root then switch to the non-root user
USER appuser

# For processes that don't need root
CMD ["nginx", "-g", "daemon off;"]