import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApiKeysTable1660000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "api_keys" (
        "id" varchar PRIMARY KEY,
        "key" varchar NOT NULL UNIQUE,
        "owner" varchar,
        "active" boolean NOT NULL DEFAULT 1,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "api_keys";');
  }
}
