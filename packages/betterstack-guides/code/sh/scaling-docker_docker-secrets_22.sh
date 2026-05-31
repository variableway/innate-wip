# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: command
# Normalized: sh
# Block index: 22

docker service update --monitor \
    --secret-add source=new_secret,target=secret \
    myservice