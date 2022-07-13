import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentReferenceId16271212600070 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "payment" add "reference_id" varchar;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "payment" delete "reference_id";
        `;
        await queryRunner.query(sql);
    }
}
