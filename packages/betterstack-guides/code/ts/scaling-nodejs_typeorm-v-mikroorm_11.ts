# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 11

// MikroORM migration file
export class CreateUserTable extends Migration {
    async up(): Promise<void> {
        this.addSql(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" varchar(50) NOT NULL UNIQUE
            )
        `);
    }

    async down(): Promise<void> {
        this.addSql(`DROP TABLE "user"`);
    }
}