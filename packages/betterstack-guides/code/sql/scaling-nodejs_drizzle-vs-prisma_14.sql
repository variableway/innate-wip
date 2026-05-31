# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: sql
# Normalized: sql
# Block index: 14

-- Migration: 20230512134523_add_user_roles
-- Generated at: 2023-05-12T13:45:23.000Z

ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';