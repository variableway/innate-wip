# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: prisma
# Normalized: js
# Block index: 9

[label prisma/schema.prisma]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}