# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/
# Original language: command
# Normalized: sh
# Block index: 34

curl -v -H "traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01" \
     -H "tracestate: rojo=00f067aa0ba902b7" \
     -H "X-Request-Id: f45a82a7-7066-40d4-981d-145952c290f8" \
     http://localhost