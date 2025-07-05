import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1751691942747 implements MigrationInterface {
    name = 'InitDatabase1751691942747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact" ("id" character varying(26) NOT NULL, "meta_contact_id" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_95e06f022df4dfc96789c9535fe" UNIQUE ("meta_contact_id"), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."conversation_type_enum" AS ENUM('direct', 'group', 'broadcast')`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" character varying(26) NOT NULL, "type" "public"."conversation_type_enum" NOT NULL, "subject" character varying(60), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP DEFAULT now(), "contact_id" character varying(26), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."message_type_enum" AS ENUM('text', 'image', 'audio', 'video', 'sticker', 'document', 'unsupported')`);
        await queryRunner.query(`CREATE TABLE "message" ("id" character varying(26) NOT NULL, "type" "public"."message_type_enum" NOT NULL, "text" text, "meta_message_id" character varying(255) NOT NULL, "meta_media_id" character varying(255), "media_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP DEFAULT now(), "conversation_id" character varying(26), CONSTRAINT "UQ_4a1234ea08306efbe89b23f28b9" UNIQUE ("meta_message_id"), CONSTRAINT "UQ_be6dceabe317be64f6be530322c" UNIQUE ("meta_media_id"), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_497e6b0cfc02cd94483f194b8bc" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_497e6b0cfc02cd94483f194b8bc"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TYPE "public"."conversation_type_enum"`);
        await queryRunner.query(`DROP TABLE "contact"`);
    }

}
