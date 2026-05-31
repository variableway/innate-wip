# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 33

stdout := logfmt.New(os.Stdout)
stderr := json.New(os.Stderr)

[highlight]
log.SetHandler(multi.New(stdout, stderr))
[highlight]