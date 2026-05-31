# Source: https://betterstack.com/community/guides/scaling-docker/docker-volumes/
# Original language: command
# Normalized: sh
# Block index: 20

# Create a volume for build artifacts
docker volume create build_artifacts

# Run a build container
docker run --rm \
  -v build_artifacts:/build \
  -v $(pwd)/src:/source \
  node:14 \
  sh -c 'cd /source && npm install && npm run build && cp -r dist/* /build/'

# Run a web server to serve the built artifacts
docker run -d \
  --name web \
  -v build_artifacts:/usr/share/nginx/html \
  -p 8080:80 \
  nginx:latest