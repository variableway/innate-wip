---
title: Git Basics
description: Essential Git commands and workflows for version control
category: Tools
tags: [git, version-control, cli]
lastUpdated: 2024-01-20
---

# Git Basics

A quick reference guide for the most commonly used Git commands.

## Repository Setup

```bash
# Initialize a new repository
git init

# Clone an existing repository
git clone <repository-url>
```

## Basic Commands

```bash
# Check status
git status

# Stage changes
git add <file>
git add .  # Stage all changes

# Commit changes
git commit -m "commit message"

# Push changes
git push origin <branch>
```

## Branching

```bash
# Create and switch to new branch
git checkout -b <branch-name>

# Switch branches
git checkout <branch-name>

# List branches
git branch

# Delete branch
git branch -d <branch-name>
```

## Remote Operations

```bash
# Add remote
git remote add origin <repository-url>

# List remotes
git remote -v

# Fetch changes
git fetch

# Pull changes
git pull origin <branch>
```

## History & Diff

```bash
# View commit history
git log
git log --oneline  # Compact view

# View changes
git diff
git diff --staged  # View staged changes
```
