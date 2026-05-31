# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-debugging/
# Original language: javascript
# Normalized: js
# Block index: 28

[label .vscode/launch.json]
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            [highlight]
            "name": "Launch Wikipedia App",
            [/highlight]
            "skipFiles": [
                "<node_internals>/**"
            ],
            [highlight]
            "program": "${workspaceFolder}/server.js"
            [/highlight]
        }
    ]
}