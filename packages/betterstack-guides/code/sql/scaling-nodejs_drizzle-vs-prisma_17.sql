# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: sql
# Normalized: sql
# Block index: 17

-- Migration: 0001_add_user_roles
CREATE TABLE IF NOT EXISTS "drizzle_migrations" (
  "id" SERIAL PRIMARY KEY,
  "hash" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now()
);

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar(255) NOT NULL DEFAULT 'USER';