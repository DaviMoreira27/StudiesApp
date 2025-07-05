import { MigrationInterface, QueryRunner } from 'typeorm';

export class TablesPluralization1751726966335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.startTransaction();
    try {

        await queryRunner.renameTable('message', 'messages');
        await queryRunner.renameTable('conversation', 'conversations');
        await queryRunner.renameTable('contact', 'contacts');
        queryRunner.commitTransaction();
    } catch (error: unknown) {
        queryRunner.rollbackTransaction();
        throw error;
    }

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.startTransaction();
    try {
        await queryRunner.renameTable('messages', 'message');
        await queryRunner.renameTable('conversations', 'conversation');
        await queryRunner.renameTable('contacts', 'contact');
        queryRunner.commitTransaction();
    } catch(error: unknown) {
        queryRunner.rollbackTransaction();
        throw error;
    }
  }
}
