# Source: https://betterstack.com/community/guides/scaling-docker/podman-logging/
# Original language: command
# Normalized: sh
# Block index: 14

# Count occurrences of specific terms
podman logs web-server | grep -i error | wc -l

# Extract unique error messages
podman logs web-server | grep -i error | sort | uniq -c | sort -nr

# Extract request patterns from an HTTP server
podman logs web-server | grep "GET" | awk '{print $7}' | sort | uniq -c | sort -nr