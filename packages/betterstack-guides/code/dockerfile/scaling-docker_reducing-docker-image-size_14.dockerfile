# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 14

[label Dockerfile]
FROM python:3.10-alpine AS builder
WORKDIR /app
# Install build dependencies
RUN apk add --no-cache gcc musl-dev python3-dev
COPY requirements.txt .
# Create wheels for faster installation
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.10-alpine
WORKDIR /app
COPY --from=builder /wheels /wheels
COPY requirements.txt .
# Install from pre-built wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels
COPY . .
CMD ["python", "app.py"]