import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContent1749893922782 implements MigrationInterface {
	name = 'CreateContent1749893922782';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "contents"`);
		await queryRunner.query(
			`CREATE TABLE "contents" (
				"id" SERIAL NOT NULL,
				"groupId" integer NOT NULL,
				"userId" integer NOT NULL,
				"message" text NOT NULL DEFAULT '',
				"active" integer NOT NULL DEFAULT '1',
				"dateCreate" TIMESTAMP NOT NULL DEFAULT 'now',
				CONSTRAINT "PK_b7c504072e537532d7080c54fac" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "contents"`);
	}
}
