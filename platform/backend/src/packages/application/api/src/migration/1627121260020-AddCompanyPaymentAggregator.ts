import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyPaymentAggregator1627121260020 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "company_payment_aggregator"
            (
                "id" serial not null 
                    constraint "company_payment_aggregator_id_pkey" primary key,
                "company_id" integer
                    constraint "company_payment_aggregator_id_key" unique
                    constraint "company_payment_aggregator_id_fkey" references "company",
                "uid" varchar not null,
                "type" varchar not null,
                "key" varchar not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "company_payment_aggregator" cascade;
        `;
        await queryRunner.query(sql);
    }
}
