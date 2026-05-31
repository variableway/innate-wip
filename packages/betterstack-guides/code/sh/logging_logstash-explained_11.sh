# Source: https://betterstack.com/community/guides/logging/logstash-explained/
# Original language: command
# Normalized: sh
# Block index: 11

docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" docker.elastic.co/logstash/logstash:9.0.1 --config.test_and_exit