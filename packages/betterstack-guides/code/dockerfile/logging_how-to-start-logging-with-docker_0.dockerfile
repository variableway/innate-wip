# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 0

[label Dockerfile]
# forward logs to Docker's log collector
RUN ln -sf /dev/stdout <log_file_path> \
	&& ln -sf /dev/stderr <error_log_file_path>