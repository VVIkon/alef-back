/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1746187315285 implements MigrationInterface {
	name = 'UserTable1746187315285';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "users_id_seq" OWNED BY "users"."id"`);

		// await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('"users_id_seq"')`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "login" character varying(64)`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(64)`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fio"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "fio" character varying(128)`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(128)`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "token" character varying(512)`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "salt"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "salt" int8 DEFAULT 0 NOT NULL`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token_expare"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "token_expare" int8 DEFAULT 1 NOT NULL`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "permition_id"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "permition_id" int8 DEFAULT 1 NOT NULL`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "active" int4 DEFAULT 0 NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fio"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "fio" character(128)`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "password" character(64)`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "login" character(64)`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('usr_id')`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
		await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
	}
}
