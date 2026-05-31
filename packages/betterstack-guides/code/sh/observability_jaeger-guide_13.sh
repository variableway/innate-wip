# Source: https://betterstack.com/community/guides/observability/jaeger-guide/
# Original language: command
# Normalized: sh
# Block index: 13

seq 1 50 | xargs -I {} -n1 -P10  curl --header "Baggage: session=9001,request=9001-{}" "http://localhost:8080/dispatch?customer=392"