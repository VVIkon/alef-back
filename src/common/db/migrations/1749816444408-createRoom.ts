import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoom1749816444408 implements MigrationInterface {
	name = 'CreateRoom1749816444408';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "rooms" CASCADE`);
		await queryRunner.query(
			`CREATE TABLE "rooms" (
			"id" SERIAL NOT NULL,
			"name" character varying(64) NOT NULL,
			"userId" integer NOT NULL,
			"groups" integer array NOT NULL DEFAULT '{}',
			"users" integer array NOT NULL DEFAULT '{}',
			"channels" integer array NOT NULL DEFAULT '{}',
			"active" integer NOT NULL DEFAULT '1',
			"dateCreate" TIMESTAMP NOT NULL DEFAULT 'now',
			CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "rooms" CASCADE`);
	}
}
