# Source: https://betterstack.com/community/guides/logging/filebeat-explained/
# Original language: command
# Normalized: sh
# Block index: 15

docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  docker.elastic.co/beats/filebeat:9.0.1 \
  filebeat test config