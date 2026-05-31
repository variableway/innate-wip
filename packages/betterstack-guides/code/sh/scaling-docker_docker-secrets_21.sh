# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 21

docker service update \
    --secret-rm db_password_v1 \
    --secret-add source=db_password_v2,target=db_password \
    myservice