# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 15

[label Dockerfile]
FROM python:3.10-slim AS builder
WORKDIR /app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
# Configure poetry to not use virtual environments in Docker
RUN poetry config virtualenvs.create false
# Export dependencies as requirements.txt
RUN poetry export -f requirements.txt > requirements.txt
# Build wheels
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.10-slim
WORKDIR /app
# Copy only requirements and wheels
COPY --from=builder /app/requirements.txt .
COPY --from=builder /wheels /wheels
# Install from wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels
# Copy application code
COPY . .
CMD ["python", "app.py"]