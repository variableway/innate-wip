# Source: https://betterstack.com/community/guides/observability/opentelemetry-nodejs-tracing/
# Original language: javascript
# Normalized: js
# Block index: 12

[output]
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:/usr/local/bin/node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0',
      'process.pid': 60,
      'process.executable.name': '/usr/local/bin/node',
      'process.executable.path': '/usr/local/bin/node',
      'process.command_args': ['/usr/local/bin/node', '/node/app/auth/server.js'],
      'process.runtime.version': '20.17.0',
      'process.runtime.name': 'nodejs',
      'process.runtime.description': 'Node.js',
      'process.command': '/node/app/auth/server.js',
      'process.owner': 'root',
      'host.name': 'a4e67b9cd391',
      'host.arch': 'amd64'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-http',
    version: '0.53.0',
    schemaUrl: undefined
  },
  traceId: '22695de23822cd0d7a401cc0494e5e16',
  parentId: undefined,
  traceState: undefined,
  name: 'GET',
  id: '4fe792539cbf5b61',
  kind: 1,
  timestamp: 1728405972211000,
  duration: 46121.586,
  attributes: {
    'http.url': 'http://localhost:8000/auth',
    'http.host': 'localhost:8000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/auth',
    'http.user_agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'net.host.ip': '172.31.0.4',
    'net.host.port': 8000,
    'net.peer.ip': '172.31.0.1',
    'net.peer.port': 53694,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: {
    code: 0
  },
  events: [],
  links: []
}