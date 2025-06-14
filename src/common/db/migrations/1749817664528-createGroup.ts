import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroup1749817664528 implements MigrationInterface {
	name = 'CreateGroup1749817664528';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "groups"`);
		await queryRunner.query(
			`CREATE TABLE "groups" (
			"id" SERIAL NOT NULL,
			"nameGroup" character varying(64) NOT NULL,
			"typeGroup" character varying NOT NULL DEFAULT 'public',
			"userId" integer NOT NULL,
			"users" integer array NOT NULL DEFAULT '{}',
			"moderators" integer array NOT NULL DEFAULT '{}',
			"active" integer NOT NULL DEFAULT '1',
			"readOnly" integer NOT NULL DEFAULT '0',
			"dateCreate" TIMESTAMP NOT NULL DEFAULT 'now',
			CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "groups"`);
	}
}
