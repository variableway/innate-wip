# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: hcl
# Normalized: terraform
# Block index: 25

pid_file = "/tmp/vault-agent.pid"

auto_auth {
  method "token" {
    config {
      token = env.VAULT_TOKEN
    }
  }
}

template {
  source      = "/etc/vault/templates/db-creds.tmpl"
  destination = "/run/secrets/db-credentials"
}