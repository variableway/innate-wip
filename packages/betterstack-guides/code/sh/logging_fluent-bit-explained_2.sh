# Source: https://betterstack.com/community/guides/logging/fluent-bit-explained/
# Original language: bash
# Normalized: sh
# Block index: 2

[label log-processing-stack/logify/logify.sh]
#!/bin/bash
filepath="/var/log/logify/app.log"

create_log_entry() {
    local info_messages=("Connected to database" "Task completed successfully" "Operation finished" "Initialized application")
    local random_message=${info_messages[$RANDOM % ${#info_messages[@]}]}
    local http_status_code=200
    local ip_address="127.0.0.1"
    local emailAddress="user@mail.com"
    local level=30
    local pid=$$
    local ssn="407-01-2433"
    local time=$(date +%s)
    local log='{"status": "'$http_status_code'", "ip": "'$ip_address'", "level": '$level', "emailAddress": "'$emailAddress'", "msg": "'$random_message'", "pid": '$pid', "ssn": "'$ssn'", "timestamp": '$time'}'
    echo "$log"
}

while true; do
    log_record=$(create_log_entry)
    echo "${log_record}" >> "${filepath}"
    sleep 3
done