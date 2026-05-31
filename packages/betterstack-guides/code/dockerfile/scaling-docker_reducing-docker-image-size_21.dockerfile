# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 21

[label Dockerfile]
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build with additional flags to reduce size
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o app .

FROM scratch
WORKDIR /app
# Copy CA certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
# Copy the binary
COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]