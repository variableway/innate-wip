---
title: "Lessons from Going Monorepo"
slug: monorepo-journey
date: 2026-04-12
author: Innate Team
category: insight
tags: [monorepo, architecture, nextjs, pnpm]
status: published
excerpt: We moved to a pnpm workspace monorepo. Here's what worked, what didn't, and why we'd do it again.
---

## Why Monorepo

Managing multiple packages with shared components was getting painful. We had UI components in one repo, utilities in another, and the web app in a third. Every update meant publishing packages, bumping versions, and hoping nothing broke.

**The breaking point:** we spent an entire afternoon debugging a version mismatch between `@innate/ui` and `@innate/utils`. Never again.

## The Setup

We chose **pnpm workspaces** with Turbopack. The structure looks like this:

```
innate-websites/
├── apps/web/          # Next.js app
├── packages/ui/       # Shared UI components
├── packages/utils/    # Shared utilities
└── pnpm-workspace.yaml
```

## What Worked

### 1. Shared Dependencies
One `node_modules`, one install. Dependencies are deduplicated automatically.

### 2. Atomic Changes
Need to update a button component and the page that uses it? One PR, one review, one deploy.

### 3. Type Safety Across Packages
TypeScript project references mean changes in `utils` are immediately visible in `web`. No more waiting for published types.

## What Didn't

### 1. Build Times
Initially slower. Turbopack helped a lot, but the first cold build still takes a moment.

### 2. Mental Model
New contributors need to understand the workspace structure. We added a README map to help.

## The Verdict

For a team our size, the monorepo trade-off is overwhelmingly positive. The DX improvement alone justifies it.

> If you're maintaining 2+ packages that depend on each other, just go monorepo. Your future self will thank you.
