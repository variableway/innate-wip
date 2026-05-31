# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: promql
# Normalized: js
# Block index: 30

#HELP post_request_duration_seconds Duration of requests to jsonplaceholder
#TYPE post_request_duration_seconds summary
post_request_duration_seconds_sum{method="GET"} 8.648272037506104
post_request_duration_seconds_count{method="GET"} 25
post_request_duration_seconds{method="GET",quantile="0.5"} 0.3418126106262207
post_request_duration_seconds{method="GET",quantile="0.9"} 0.35525965690612793
post_request_duration_seconds{method="GET",quantile="0.99"} 0.49892544746398926