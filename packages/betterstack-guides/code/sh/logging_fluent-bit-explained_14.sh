# Source: https://betterstack.com/community/guides/logging/fluent-bit-explained/
# Original language: command
# Normalized: sh
# Block index: 14

docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf