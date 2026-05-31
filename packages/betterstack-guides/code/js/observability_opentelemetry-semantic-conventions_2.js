# Source: https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/
# Original language: javascript
# Normalized: js
# Block index: 2

{
  attributes: {
    'db.system': 'postgresql',
    'db.name': 'ads',
    'db.connection_string': 'postgresql://adservice:5432/ads',
    'net.peer.name': 'adservice-db',
    'net.peer.port': 5432,
    'db.user': 'postgres',
    'db.statement': "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'"
  }
}