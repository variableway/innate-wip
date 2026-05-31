# Source: https://betterstack.com/community/guides/logging/logstash-explained/
# Original language: command
# Normalized: sh
# Block index: 27

docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" -v "/var/log/logify:/var/log/logify" docker.elastic.co/logstash/logstash:9.0.1