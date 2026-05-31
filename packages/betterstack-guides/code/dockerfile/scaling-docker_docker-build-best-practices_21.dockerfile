# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 21

[label Dockerfile]
FROM node:22
# For temporary variables that shouldn't persist in the image
RUN export TEMP_VAR=value && \
   do-something-with $TEMP_VAR && \
   unset TEMP_VAR