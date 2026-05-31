# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 20

[label Dockerfile]
FROM golang:1.24-alpine AS builder
WORKDIR /app
# Copy go.mod and go.sum first for better caching
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build a static binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM scratch
WORKDIR /app
# Copy only the binary
COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]