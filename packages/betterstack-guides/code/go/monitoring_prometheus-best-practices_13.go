# Source: https://betterstack.com/community/guides/monitoring/prometheus-best-practices/
# Original language: go
# Normalized: go
# Block index: 13

for _, val := range errorLabelValues {
	errorsCounter.WithLabelValues(val) // Don't use Inc()
}