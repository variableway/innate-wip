# Source: https://betterstack.com/community/guides/scaling-docker/docker-security-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 1

# Builder stage: building the executable
FROM golang:1.20.8-alpine as builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp

# Final stage: build the container to run
FROM scratch as final

COPY --from=builder /app/myapp /