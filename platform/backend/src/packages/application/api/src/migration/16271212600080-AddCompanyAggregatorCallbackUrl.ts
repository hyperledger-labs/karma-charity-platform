import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyAggregatorCallbackUrl16271212600080 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "company_payment_aggregator" add "callback_url" varchar;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "company_payment_aggregator" delete "callback_url";
        `;
        await queryRunner.query(sql);
    }
}
