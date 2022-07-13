import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentTransaction16271212600031 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "payment_transaction"
            (                
                "id" serial not null
                    constraint "payment_transaction_pkey" primary key,
                "type" varchar not null,
                "amount" numeric not null,
                "coin_id" varchar not null,
                "debet" varchar not null,
                "credit" varchar not null,
                "ledger_transaction" varchar not null,

                "activated_date" timestamp,
                "created_date" timestamp default now() not null,

                "company_id" integer
                    constraint "payment_transaction_company_id_fkey" references "company",
                "project_id" integer
                    constraint "payment_transaction_project_id_fkey" references "project",

                "payment_id" integer not null
                    constraint "payment_transaction_payment_id_fkey" references "payment"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "payment_transaction" cascade;
            drop index if exists "payment_transaction_company_id_fkey";
            drop index if exists "payment_transaction_project_id_fkey";
            drop index if exists "payment_transaction_payment_id_fkey";
        `;
        await queryRunner.query(sql);
    }
}
