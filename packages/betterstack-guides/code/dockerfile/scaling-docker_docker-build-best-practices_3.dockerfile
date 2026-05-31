# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 3

[label Dockerfile]
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]