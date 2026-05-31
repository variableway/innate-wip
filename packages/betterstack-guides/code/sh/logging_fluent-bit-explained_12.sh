# Source: https://betterstack.com/community/guides/logging/fluent-bit-explained/
# Original language: command
# Normalized: sh
# Block index: 12

docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest --dry-run -c /fluent-bit/etc/fluent-bit.conf