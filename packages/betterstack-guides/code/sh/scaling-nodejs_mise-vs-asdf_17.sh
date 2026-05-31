# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 17

# Update asdf itself
$ asdf update
Updated asdf from version v0.15.0 to v0.16.0

# Update plugins
$ asdf plugin update --all
Updating nodejs...  updated
Updating ruby...    updated
Updating python...  updated

# Check for outdated versions
$ asdf latest --all
nodejs          20.11.0
ruby            3.3.0
python          3.12.1