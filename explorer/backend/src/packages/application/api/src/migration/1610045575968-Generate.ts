import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1610045575968 implements MigrationInterface {
    name = 'Generate1610045575968';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ledger_block_event" ADD "is_batch" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "ledger_block_transaction" ADD "is_batch" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "ledger_block_transaction" ADD "block_batched" integer`, undefined);
        await queryRunner.query(
            `ALTER TABLE "ledger_block_event" ADD CONSTRAINT "ledger_block_event_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "ledger_block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "ledger_block_transaction" ADD CONSTRAINT "ledger_block_transaction_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "ledger_block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}
