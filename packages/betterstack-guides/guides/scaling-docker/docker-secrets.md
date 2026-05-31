# A Comprehensive Guide to Docker Secrets

In modern containerized applications, managing sensitive information like
passwords, API keys, and SSL certificates poses significant security challenges.

Hard-coding these credentials or using environment variables can expose them to
unauthorized access and create security vulnerabilities.

Docker Secrets provides a robust solution by offering encrypted storage and
secure distribution of sensitive data to only the containers that need them.

This comprehensive guide will walk you through everything you need to know about
implementing and managing Docker Secrets effectively.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/uRA7qee4Frg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Understanding Docker Secrets

Docker Secrets is a built-in secrets management system that operates at the
Docker Swarm level. A secret can be any piece of sensitive data, such as:

- Database passwords
- API keys
- SSH private keys
- TLS certificates
- Other confidential configuration data

When you create a secret in Docker, the system encrypts it both at rest and
during transit. The encrypted secret is stored in the Swarm's Raft database,
which serves as the source of truth for your cluster's desired state. The beauty
of this system lies in its granular access control since only containers
explicitly granted permission can access the decrypted value of a secret.

The storage and access mechanisms of secrets follow specific patterns based on
the container's operating system. In Linux containers, secrets are mounted at
`/run/secrets/<secret_name>`, while Windows containers store them at
`C:\ProgramData\Docker\secrets`. These default locations can be customized
during service deployment to match your application's requirements.

The security model of Docker Secrets extends beyond just encryption. Access to
secrets is strictly controlled at the node level within your Swarm. Only Swarm
managers and nodes running tasks for services that have been explicitly granted
access can interact with encrypted secrets.

Docker Secrets implements intelligent memory management to further enhance
security. When a container terminates, the system automatically removes any
secrets it had access to from both the container's in-memory filesystem and the
node's memory.

The system also includes robust handling of network disruptions. If a node loses
its connection to the Swarm while running a task that uses secrets, the task
retains access to its existing secrets, ensuring application continuity.
However, the node won't receive any updates to those secrets until it
reestablishes its connection to the Swarm.

## Prerequisites

Docker Secrets requires a specific environment setup to function properly. The
primary requirement is [Docker](https://docs.docker.com/engine/install/) running
in Swarm mode, which provides the orchestration layer necessary for secrets
management.

To initialize Docker Swarm, you first need to designate a manager node. This is
done using the following command:

```command
docker swarm init --advertise-addr <manager_server_ip>
```

```text
[output]
Swarm initialized: current node (9r83zto8qpqiazt6slxfkjypq) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token <token> <manager_server_ip>:<port>


To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

This command transforms your Docker installation into a Swarm manager node and
outputs a token that other nodes can use to join the swarm. When adding worker
nodes, you'll use the join token provided:

```command
docker swarm join --token <token> <manager_server_ip>:<port>
```

```text
[output]
This node joined a swarm as a worker.
```

## Creating and managing Docker secrets

Docker provides several methods for creating secrets, each suited to different
use cases. Let's explore these methods in detail:

- Creating a secret from standard input:

```command
echo "mySecurePassword123" | docker secret create db_password -
```

```text
[output]
i2dolb184uoh0kkleerasua9u
```

You'll see the ID of the secret you just created which may later be used to
reference the secret in other Docker commands.

- Creating a secret from a file:

```command
docker secret create ssl_certificate ./path/to/cert.pem
```

When you create a secret, Docker immediately encrypts it and stores it in the
Swarm's distributed database. The original file or input is not retained in
unencrypted form.

To manage existing secrets, Docker provides several commands. To view all
secrets in the swarm, execute:

```command
docker secret ls
```

```text
ID                          NAME          DRIVER    CREATED         UPDATED
i2dolb184uoh0kkleerasua9u   db_password             7 minutes ago   7 minutes ago
```

To inspect a specific secret's metadata, use:

```command
docker secret inspect db_password
```

```json
[output]
[
    {
        "ID": "i2dolb184uoh0kkleerasua9u",
        "Version": {
            "Index": 1455
        },
        "CreatedAt": "2025-02-24T11:47:27.685233322Z",
        "UpdatedAt": "2025-02-24T11:47:27.685233322Z",
        "Spec": {
            "Name": "db_password",
            "Labels": {}
        }
    }
]
```

The `inspect` command provides metadata about the secret but never reveals the
actual secret content.

Finally, you can remove secrets by passing the secret ID or name to the
following command:

```command
docker secret rm db_password
```

[ad-logs]

## Using secrets in Docker Services

When you create a service that needs access to secrets, you specify this
requirement in the service configuration. The secrets are then mounted into the
container at runtime. Here's a comprehensive example:

```command
docker service create \
    --name secure_webapp \
    --secret source=db_password,target=db_password,mode=0400 \
    --secret source=ssl_certificate \
    my_webapp:latest
```

```text
[output]
0pnoym4rb0yyl8jk52uvm5ny8
overall progress: 1 out of 1 tasks
1/1: running   [==================================================>]
verify: Service converged
```

In this example, we're creating a service named `secure_webapp` with access to
two secrets. The `mode` parameter specifies the file permissions inside the
container. By default, secrets are mounted at `/run/secrets/<secret_name>`, but
you can customize this using the `target` parameter.

The application can then read the secret value by accessing the mounted file at:

```command
cat /run/secrets/db_password
```

You can see if the secret is mounted on a container using the command below:

```command
docker container exec $(docker ps --filter name=<container-name> -q) ls -l /run/secrets
```

```text
[output]
total 4
-r--r--r--    1 root     root            24 Feb 25 12:51 db_password
```

To prevent a service from having access to the container, use:

```command
docker service update --secret-rm db_password <container-name>
```

Afterward, the `/run/secrets` directory will no longer exist in the container:

```command
docker container exec $(docker ps --filter name=<container-name> -q) ls -l /run/secrets
```

```text
[output]
ls: /run/secrets: No such file or directory
```

## Using secrets in Docker Compose

Docker Compose integration with Secrets provides a declarative way to manage
sensitive information in your containerized applications through the `secrets`
top-level key.

Here's an example:

```yaml
[label compose.yaml]
services:
  web:
    image: nginx:latest
[highlight]
    secrets:
      - source: site_ssl
        target: ssl_cert
        mode: 0400
      - source: site_key
        target: ssl_key
        mode: 0400
[/highlight]
    ports:
      - "443:443"

  database:
    image: postgres:latest
[highlight]
    secrets:
      - source: db_password
        target: postgres_password
        mode: 0400
[/highlight]
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password

[highlight]
secrets:
  site_ssl:
    file: ./certs/site.crt
  site_key:
    file: ./certs/site.key
  db_password:
    external: true
[/highlight]
```

In this configuration, secrets can be defined in three ways:

- File-based secrets, where the content comes from a file on the host system.
- External secrets, which are pre-existing secrets in the Docker Swarm.
- Environment-specific secrets, which can be different between development and
  production.

The `mode` property defines the file permissions in octal notation, allowing
fine-grained access control within the container, while `target` allows you to
customize the name and location of the secret within the container.

## Docker Secrets best practices

### 1. Secret rotation

Regular rotation of secrets minimizes the impact of potential security breaches.
You can create a new secret version by running:

```command
echo "newPassword123" | docker secret create db_password_v2 -
```

Then update your services to use new secret:

```command
docker service update \
    --secret-rm db_password_v1 \
    --secret-add source=db_password_v2,target=db_password \
    myservice
```

### 2. Monitoring secrets usage

While Docker doesn't provide built-in audit logging for secrets, you can
implement monitoring at the service level:

```command
docker service update --monitor \
    --secret-add source=new_secret,target=secret \
    myservice
```

### 3. Access control management

Implement strict access controls by limiting secret access to only essential
services. When creating services, explicitly define which secrets each service
needs:

```command
docker service create \
    --name restricted_service \
    --secret source=required_secret,mode=0400 \
    --no-resolve-image \
    myapp:latest
```

## Integration with third-party tools

While Docker Secrets provides robust native secrets management, many
organizations require integration with enterprise-grade external secret
management solutions.

These integrations enhance Docker's capabilities with additional features like
automated rotation, fine-grained access control, and compliance monitoring.
Let's look at a few of the most popular ones below:

### HashiCorp vault integration

HashiCorp Vault integration with Docker can be implemented through several
approaches. The most common method uses the Vault Agent to retrieve secrets:

```yaml
[label compose.yaml]
services:
  vault-agent:
    image: vault:latest
    volumes:
      - ./vault-agent-config.hcl:/etc/vault/vault-agent-config.hcl
      - ./vault-agent-templates:/etc/vault/templates
    environment:
      - VAULT_ADDR=https://vault.example.com
      - VAULT_TOKEN=${VAULT_TOKEN}

  application:
    image: myapp:latest
    depends_on:
      - vault-agent
    volumes:
      - ./secrets:/run/secrets
```

The Vault Agent configuration file (`vault-agent-config.hcl`) might look like
this:

```hcl
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
```

### AWS secrets manager integration

AWS Secrets Manager integration typically involves using the AWS SDK or CLI
within your containerized applications. Here's an implementation pattern:

```yaml
[label compose.yaml]
services:
  application:
    image: myapp:latest
    environment:
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=us-west-2
    command: ["./fetch-secrets.sh"]
```

The `fetch-secrets.sh` script might contain:

```bash
[label fetch-secrets.sh]
#!/bin/bash

# Fetch secret from AWS Secrets Manager
secret=$(aws secretsmanager get-secret-value \
    --secret-id myapp/database/credentials \
    --query SecretString \
    --output text)

# Parse and store the secret
echo $secret | jq -r .password > /run/secrets/db_password
```

### Azure key vault integration

Azure Key Vault integration can be achieved using the Azure SDK or managed
identity authentication:

```yaml
[label compose.yaml]
services:
  application:
    image: myapp:latest
    environment:
      - AZURE_TENANT_ID=${AZURE_TENANT_ID}
      - AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
      - AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
      - KEY_VAULT_NAME=mycompany-keyvault
```

Example implementation using Azure SDK in Python:

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
vault_url = f"https://{os.environ['KEY_VAULT_NAME']}.vault.azure.net/"
client = SecretClient(vault_url=vault_url, credential=credential)

secret = client.get_secret("database-password")
with open('/run/secrets/db_password', 'w') as f:
    f.write(secret.value)
```

### Kubernetes integration

For Kubernetes environments, the External Secrets Operator provides a unified
interface for multiple secret management systems:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
spec:
  refreshInterval: "1h"
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: database-secret
  data:
    - secretKey: password
      remoteRef:
        key: database/credentials
        property: password
```

## Final thoughts

Docker Secrets provides a robust foundation for managing sensitive information
in containerized environments. The system's integration with Docker Swarm,
combined with its security features and flexible implementation options, makes
it a powerful tool for modern application deployment.

Success with Docker Secrets requires understanding not just the technical
implementation, but also the security implications and best practices. Regular
auditing, proper secret rotation, and careful access control management are
essential components of a comprehensive secrets management strategy.

As container orchestration continues to evolve, Docker Secrets remains a crucial
component in building secure, scalable applications. Organizations should invest
time in properly implementing and maintaining their secrets management
infrastructure to ensure the security and reliability of their containerized
applications.

Thanks for reading!
