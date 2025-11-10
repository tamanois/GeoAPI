import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionAndCityFields1660000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "regions" (
        "id" varchar PRIMARY KEY,
        "name" varchar NOT NULL UNIQUE,
        "countryCode" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);
    await queryRunner.query(`
      ALTER TABLE "cities" ADD COLUMN "cityAscii" varchar;
    `);
    await queryRunner.query(`
      ALTER TABLE "cities" ADD COLUMN "capital" boolean NOT NULL DEFAULT 0;
    `);
    await queryRunner.query(`
      ALTER TABLE "cities" ADD COLUMN "regionId" varchar REFERENCES "regions"("id") ON DELETE SET NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE "countries" DROP COLUMN "region";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "cities" DROP COLUMN "regionId";');
    await queryRunner.query('ALTER TABLE "cities" DROP COLUMN "capital";');
    await queryRunner.query('ALTER TABLE "cities" DROP COLUMN "cityAscii";');
    await queryRunner.query('DROP TABLE "regions";');
    await queryRunner.query('ALTER TABLE "countries" ADD COLUMN "region" varchar;');
  }
}
