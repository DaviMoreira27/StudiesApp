import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeConversationTypeEnum1751728589541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`ALTER TYPE "conversations_type_enum" RENAME TO "conversations_type_enum_old"`);
      await queryRunner.query(`
        CREATE TYPE "conversations_type_enum" AS ENUM ('config', 'subject')
      `);
      await queryRunner.query(`
        ALTER TABLE "conversations"
        ALTER COLUMN "type"
        TYPE "conversations_type_enum"
        USING "type"::text::"conversations_type_enum"
      `);
      await queryRunner.query(`DROP TYPE "conversations_type_enum_old"`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`ALTER TYPE "conversations_type_enum" RENAME TO "conversations_type_enum_new"`);
      await queryRunner.query(`
        CREATE TYPE "conversations_type_enum" AS ENUM ('direct', 'group', 'broadcast')
      `);
      await queryRunner.query(`
        ALTER TABLE "conversations"
        ALTER COLUMN "type"
        TYPE "conversations_type_enum"
        USING "type"::text::"conversations_type_enum"
      `);
      await queryRunner.query(`DROP TYPE "conversations_type_enum_new"`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
