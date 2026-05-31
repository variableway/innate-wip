# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: sql
# Normalized: sql
# Block index: 16

-- prisma/migrations/20230415123456_add_user_settings/migration.sql
ALTER TABLE "users" ADD COLUMN "settings" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "users" ADD COLUMN "email_notifications" BOOLEAN NOT NULL DEFAULT true;