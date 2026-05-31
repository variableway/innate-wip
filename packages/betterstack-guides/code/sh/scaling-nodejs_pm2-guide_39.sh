# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: command
# Normalized: sh
# Block index: 39

sudo env PATH=$PATH:/home/<username>/.local/share/nvm/v16.14.0/bin /home/<username>/.local/share/nvm/v16.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u <username> --hp /home/<username>