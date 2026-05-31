# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: prisma
# Normalized: js
# Block index: 15

// Just modify your schema.prisma file
model User {
  id                 Int      @id @default(autoincrement())
  name               String
  settings           Json?    @default("{}")
  emailNotifications Boolean  @default(true) @map("email_notifications")
  posts              Post[]
}

// Then generate and apply a migration
npx prisma migrate dev --name add_user_settings