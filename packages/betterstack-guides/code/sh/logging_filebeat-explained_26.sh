# Source: https://betterstack.com/community/guides/logging/filebeat-explained/
# Original language: command
# Normalized: sh
# Block index: 26

docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  --name filebeat-conditional \
  docker.elastic.co/beats/filebeat:9.0.1