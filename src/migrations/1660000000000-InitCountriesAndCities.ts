import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCountriesAndCities1660000000000 implements MigrationInterface {
  name = 'InitCountriesAndCities1660000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "countries" (
        "id" varchar PRIMARY KEY,
        "name" varchar NOT NULL UNIQUE,
        "code" varchar NOT NULL UNIQUE,
        "population" bigint,
        "region" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);
    await queryRunner.query(`
      CREATE TABLE "cities" (
        "id" varchar PRIMARY KEY,
        "name" varchar NOT NULL,
        "population" bigint,
        "countryId" varchar REFERENCES "countries"("id") ON DELETE CASCADE,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "cities";');
    await queryRunner.query('DROP TABLE "countries";');
  }
}
