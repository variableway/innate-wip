# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 9

// TypeORM migration file
export class CreateUserTable1617293465123 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" varchar(50) NOT NULL UNIQUE
            )
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}