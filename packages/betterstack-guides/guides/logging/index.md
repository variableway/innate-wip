# Mastering SSH Logs: A Comprehensive Guide

SSH (Secure Shell) logs provide invaluable insights into your system's security
posture and connection activity. For system administrators and security
professionals, understanding how to effectively configure, monitor, and analyze
these logs is essential for maintaining secure systems.

This article explores the fundamentals of SSH logging, from basic configuration
to advanced security practices, with practical examples to help you implement
effective monitoring solutions.

[ad-logs]

## Understanding SSH logs

SSH logs serve as the record-keeping system for all SSH-related activities on
your server. When properly configured and monitored, they help you track user
access, identify suspicious behaviors, and troubleshoot connectivity issues.
These logs capture critical information about authentication attempts, session
activities, and potential security threats.

SSH daemon (`sshd`) is responsible for handling SSH connections and generating
log entries. Each log entry typically contains timestamp information, user
details, IP addresses, authentication methods, and connection status. This rich
set of data enables administrators to maintain a comprehensive audit trail and
respond quickly to security incidents.

A typical SSH log entry looks something like this:

```text
[output]
Jul 17 14:32:45 myserver sshd[1234]: Accepted publickey for admin from 192.168.1.50 port 45678 ssh2: RSA SHA256:Ab3d9EfGhIjK1mN0pQrSt2uVwXyZ
```

This entry shows a successful login using public key authentication, including
when it happened, which user authenticated, from which IP address, and what
encryption was used.

## Where SSH logs are stored

The location of SSH logs varies by operating system and configuration. Knowing
where to find these logs is the first step in effective monitoring.

### Common log locations

On most Linux distributions, SSH logs are stored in one of the following
locations:

- **Debian/Ubuntu**: `/var/log/auth.log`
- **RHEL/CentOS/Fedora**: `/var/log/secure`
- **Systems using systemd**: Accessible via the `journalctl` command
- **Custom locations**: Defined in `/etc/ssh/sshd_config`

To confirm where your system is storing SSH logs, you can check the SSH daemon
configuration:

```command
grep -i log /etc/ssh/sshd_config
```

On modern systems using systemd (such as recent versions of Ubuntu, CentOS, and
Fedora), logs are managed by the journald service and can be accessed using the
journalctl command:

```command
journalctl -u ssh
```

For older systems or those not using systemd, you can directly examine the log
files:

```command
tail -f /var/log/auth.log    # For Debian/Ubuntu
```

or

```command
tail -f /var/log/secure      # For RHEL/CentOS
```

## Anatomy of SSH log entries

Understanding the structure of SSH log entries helps you extract meaningful
information when monitoring or troubleshooting. Each entry contains several key
components:

1. **Timestamp**: When the event occurred
2. **Hostname**: The server generating the log
3. **Process name and ID**: Usually "sshd" followed by the process ID in
   brackets
4. **Message type**: Indicates whether the entry is informational, a warning, or
   an error
5. **Event details**: The specific action or event being logged

Let's examine some common types of SSH log entries:

### Successful authentication

```text
[output]
Jul 17 15:45:23 webserver sshd[5678]: Accepted password for devuser from 10.0.2.15 port 49812 ssh2
```

This entry shows:

- A successful login at 15:45:23 on July 17
- The user "devuser" logged in using password authentication
- The connection came from IP address 10.0.2.15
- The client connected from port 49812
- SSH protocol version 2 was used

### Failed authentication

```text
[output]
Jul 17 15:47:10 webserver sshd[5679]: Failed password for invalid user admin from 45.227.253.82 port 38654 ssh2
```

This entry indicates:

- An unsuccessful login attempt at 15:47:10
- The attempted username "admin" is considered invalid on this system
- The connection came from IP address 45.227.253.82, which might be suspicious
- The client connected from port 38654

### Public key authentication

```text
[output]
Jul 17 15:49:45 webserver sshd[5680]: Accepted publickey for jenkins from 10.0.2.20 port 52413 ssh2: RSA SHA256:LmNoPqRsTuVwXyZ1234567890AbCdEfGhIjK
```

This shows:

- A successful login using public key authentication
- The user "jenkins" authenticated successfully
- The SSH key fingerprint was recorded for audit purposes

### Session termination

```text
[output]
Jul 17 16:02:33 webserver sshd[5678]: Disconnected from user devuser 10.0.2.15 port 49812
```

This entry indicates:

- The SSH session for user "devuser" was terminated
- The session ended at 16:02:33
- The connection was from IP 10.0.2.15

## Configuring SSH logging

Proper configuration of SSH logging ensures you capture the right amount of
information without overwhelming your storage capacity. The main configuration
file for SSH is located at `/etc/ssh/sshd_config`.

### Setting log levels

You can control the verbosity of SSH logs by adjusting the `LogLevel` directive
in the SSH configuration file. The available levels range from minimal logging
to extensive debugging information:

- **QUIET**: Logs almost nothing
- **FATAL**: Logs only fatal errors
- **ERROR**: Logs errors that might impact functionality
- **INFO**: Standard logging level (default)
- **VERBOSE**: More detailed than INFO
- **DEBUG** (or DEBUG1, DEBUG2, DEBUG3): Extensive logging for troubleshooting

To modify the log level, edit the SSH configuration file:

```command
sudo nano /etc/ssh/sshd_config
```

Find or add the LogLevel directive:

```text
[label /etc/ssh/sshd_config]
LogLevel VERBOSE
```

After saving your changes, restart the SSH service to apply them:

```command
sudo systemctl restart sshd
```

### Configuring syslog facility

The `SyslogFacility` directive determines which system logging facility SSH
should use. This helps organize log messages and direct them to appropriate
files:

```text
[label /etc/ssh/sshd_config]
SyslogFacility AUTHPRIV
```

Common values for SyslogFacility include:

- **AUTH**: Authentication-related logs (default on many systems)
- **AUTHPRIV**: Similar to AUTH, but with restricted access
- **DAEMON**: General system daemon logs
- **USER**: User-level messages

Remember to restart SSH after making changes:

```command
sudo systemctl restart sshd
```

## Analyzing SSH logs

The real value of SSH logs comes from analysis. Let's explore various techniques
to extract meaningful information from your logs.

### Basic log filtering

You can use standard command-line tools to filter and analyze SSH logs:

**Find all failed login attempts:**

```command
grep "Failed password" /var/log/auth.log
```

**Check login attempts for a specific user:**

```command
grep "user john" /var/log/auth.log
```

**Find connections from a specific IP address:**

```command
grep "192.168.1.100" /var/log/auth.log
```

### Using journalctl for advanced filtering

On systems using systemd, `journalctl` provides powerful filtering capabilities:

**View SSH logs from the last hour:**

```command
journalctl -u ssh --since "1 hour ago"
```

**Filter logs by date range:**

```command
journalctl -u ssh --since "2023-07-01" --until "2023-07-12"
```

**Show only error messages:**

```command
journalctl -u ssh -p err
```

**Monitor logs in real-time:**

```command
journalctl -u ssh -f
```

### Analyzing login patterns

To identify suspicious patterns, like repeated login attempts that might
indicate brute force attacks:

```command
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr
```

This command:

1. Extracts all failed password attempts
2. Isolates the IP addresses (field 11)
3. Sorts them
4. Counts unique occurrences
5. Sorts in descending order by count

The result shows which IP addresses have the most failed login attempts,
potentially identifying attack sources.

## Enhancing SSH log security

Implementing good logging practices is only part of the security equation. Here
are some strategies to enhance your SSH security through better logging and
monitoring.

### Increasing log verbosity for troubleshooting

When troubleshooting SSH issues, temporarily increasing log verbosity can
provide more detailed information:

```text
[label /etc/ssh/sshd_config]
LogLevel DEBUG
```

After solving the issue, remember to reset to a more reasonable level like
VERBOSE or INFO to avoid filling your logs with unnecessary data.

### Using audit logs for advanced tracking

Linux's audit system provides another layer of logging for SSH activities. You
can set up audit rules to track access to SSH configuration files:

```command
sudo auditctl -w /etc/ssh/sshd_config -p wa -k ssh_config_changes
```

This command creates an audit rule that watches for write or attribute changes
to the SSH config file and tags these events with the "ssh_config_changes" key.

To view audit logs related to SSH configuration changes:

```command
sudo ausearch -k ssh_config_changes
```

### Real-time monitoring and alerting

Setting up real-time monitoring helps you respond quickly to potential security
threats. Here's a simple script that watches for failed login attempts and sends
an email alert:

```text
[label monitor_ssh.sh]
#!/bin/bash

tail -f /var/log/auth.log | grep --line-buffered "Failed password" | while read line
do
  echo "$(date): SSH authentication failure detected" | mail -s "SSH Alert: Failed Login" admin@example.com
  echo "$line" >> /var/log/ssh_alerts.log
done
```

Make the script executable and run it in the background:

```command
chmod +x monitor_ssh.sh
nohup ./monitor_ssh.sh &
```

For more sophisticated monitoring, consider using tools like Fail2Ban, which can
automatically block IP addresses with excessive failed login attempts.

## Troubleshooting with SSH logs

SSH logs are invaluable for diagnosing connection problems and security issues.
Here are some common troubleshooting scenarios and how to approach them using
logs.

### Authentication failures

If users report they cannot authenticate, check the logs for specific error
messages:

```command
grep "authentication failure" /var/log/auth.log
```

Common issues include:

1. **Incorrect permissions**: SSH is very sensitive to file permissions. Check
   the logs for messages about permissions:

```command
grep "bad ownership or modes" /var/log/auth.log
```

Fix permissions on key files:

```command
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

2. **Invalid keys**: Look for messages about rejected keys:

```command
grep "key_read" /var/log/auth.log
```

3. **PAM authentication issues**: Check for PAM-related errors:

```command
grep "pam_" /var/log/auth.log
```

### Connection issues

For connection problems, look for messages related to negotiation failures or
timeouts:

```command
grep "Connection closed" /var/log/auth.log
```

You might also want to check for issues with the SSH protocol:

```command
grep "protocol" /var/log/auth.log
```

### Detecting unauthorized access attempts

Regularly check for unusual login patterns:

```command
grep "Accepted" /var/log/auth.log | awk '{print $1,$2,$3,$9,$11}' | sort
```

This shows successful logins sorted by date, highlighting the username and
source IP address. Unusual login times or unexpected IP addresses could indicate
compromise.

### Identifying hidden SSH tunnels

Attackers sometimes use SSH tunnels to exfiltrate data or bypass firewalls. You
can detect potential tunnels by examining established SSH connections:

```command
netstat -tnp | grep sshd
```

Compare this with your logs of legitimate user sessions:

```command
who | grep pts
```

Any discrepancies might indicate unauthorized tunnels.

## Final thoughts

SSH logs are a critical security tool for any system administrator. By
understanding how to configure, analyze, and monitor these logs effectively, you
can significantly improve your system's security posture and response
capabilities. Implementing proper logging practices not only helps detect and
prevent unauthorized access but also provides valuable forensic evidence when
incidents occur. Remember that logging is just one part of a comprehensive
security strategy—regular reviews, proper configuration, and integration with
monitoring systems are equally important to maintain secure systems.

**Meta description:** Master SSH log management with this comprehensive guide
covering configuration, analysis, and security best practices to enhance your
system's security posture and troubleshooting capabilities.