import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePaymentTransactionLedgerTransactionNotNull16271212600060 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "payment_transaction" alter column "ledger_transaction" drop not null;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "payment_transaction" alter column "ledger_transaction" set not null;
        `;
        await queryRunner.query(sql);
    }
}
