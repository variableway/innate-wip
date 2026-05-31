# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: command
# Normalized: sh
# Block index: 31

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080