import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class StatusColumnOnConversations1751693826058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'conversations',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['started', 'ongoing', 'finalized'],
        enumName: 'conversations_status_enum',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('conversations', 'status');
    await queryRunner.query(`DROP TYPE "conversations_status_enum"`);
  }
}
