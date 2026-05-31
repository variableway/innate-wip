# Source: https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/
# Original language: bash
# Normalized: sh
# Block index: 40

[label /etc/cron.daily/logrotate]
#!/bin/sh

# skip in favour of systemd timer
if [ -d /run/systemd/system ]; then
    exit 0
fi

# this cronjob persists removals (but not purges)
if [ ! -x /usr/sbin/logrotate ]; then
    exit 0
fi

[highlight]
/usr/sbin/logrotate -v /etc/logrotate.conf >> </path/to/logrotate.log> 2>&1
[/highlight]
EXITVALUE=$?
if [ $EXITVALUE != 0 ]; then
    /usr/bin/logger -t logrotate "ALERT exited abnormally with [$EXITVALUE]"
fi
exit $EXITVALUE
~