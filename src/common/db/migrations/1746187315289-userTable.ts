/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1746187315289 implements MigrationInterface {
	name = 'UserTable1746187315289';

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

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "roles" TEXT[] NOT NULL DEFAULT '{"user"}'`);

		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "active" int4 DEFAULT 0 NOT NULL`);

		await queryRunner.query(`DELETE FROM "users"`);

		await queryRunner.query(`INSERT INTO "users" ("login", "password", "fio", "email", "token", "salt", "token_expare", "roles", "active") VALUES ('grass', 'grass', 'Grass Hopper', 'grass@mail.com', '23wd4tg23qw42dd34', '234234234234', 128, '{"admin", "owner"}', 1)`);
		await queryRunner.query(`INSERT INTO "users" ("login", "password", "fio", "email", "token", "salt", "token_expare", "roles", "active") VALUES ('admin', 'admin', 'Admmin Admin', 'admin@mail.com', '23wd4tg23qw42dd34', '2344', '128', '{"admin"}', 1)`);
		await queryRunner.query(`INSERT INTO "users" ("login", "password", "fio", "email", "token", "salt", "token_expare", "roles", "active") VALUES ('user', 'user', 'User User', 'user@mail.com', '23wd4tg23qw42dd34', '2342342342', '128', '{"user"}', 1)`);
		await queryRunner.query(`INSERT INTO "users" ("login", "password", "fio", "email", "token", "salt", "token_expare", "roles", "active") VALUES ('guest', 'guest', 'Guest', 'guest@mail.com', '23wd4tg23qw42dd34', '2323232', '128', '{"guest"}', 1)`);
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
