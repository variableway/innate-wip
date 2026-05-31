# Source: https://betterstack.com/community/guides/logging/fluentd-explained/
# Original language: command
# Normalized: sh
# Block index: 23

docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf