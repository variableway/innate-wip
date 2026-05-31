# Source: https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/
# Original language: command
# Normalized: sh
# Block index: 37

amtool template render --template.glob='/etc/alertmanager/template/*.tmpl' --template.text='{{ template "email.myorg.text" . }}'