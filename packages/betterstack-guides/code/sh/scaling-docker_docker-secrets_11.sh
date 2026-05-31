# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 11

docker service create \
    --name secure_webapp \
    --secret source=db_password,target=db_password,mode=0400 \
    --secret source=ssl_certificate \
    my_webapp:latest