import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1610372054470 implements MigrationInterface {
    name = 'Generate1610372054470';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ledger_block_transaction" RENAME COLUMN "block_batched" TO "block_mined"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}
