# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/
# Original language: command
# Normalized: sh
# Block index: 74

sudo pgbadger --prefix 'time=%m pid=%p error=%e sess_id=%c %qtag=%i usr=%u db=%d app=%a ' /var/lib/postgresql/15/main/log/postgresql-Thu.log -o postgresql.html