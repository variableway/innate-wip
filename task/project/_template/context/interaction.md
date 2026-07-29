# Interaction context

Cross-task surfaces — read when tasks share files or run in parallel.

## Task graph

```
T01 → T02
T03 (docs) can parallel T01/T02 if docs-only
```

## Shared ownership

| Path | Owner task | Others |
|------|------------|--------|
| | | read-only / append-only |

## Contracts

- Types / nav registry / APIs that must stay stable

## Conflict protocol

1. Stop parallel writers on the same file
2. Record conflict here
3. Main agent arbitrates

## In progress

| Task | Agent | Started |
|------|-------|---------|
| | | |
