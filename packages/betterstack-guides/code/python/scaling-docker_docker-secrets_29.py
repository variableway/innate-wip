# Source: https://betterstack.com/community/guides/scaling-docker/docker-secrets/
# Original language: python
# Normalized: python
# Block index: 29

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
vault_url = f"https://{os.environ['KEY_VAULT_NAME']}.vault.azure.net/"
client = SecretClient(vault_url=vault_url, credential=credential)

secret = client.get_secret("database-password")
with open('/run/secrets/db_password', 'w') as f:
    f.write(secret.value)