import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayment16271212600011 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "payment"
            (                
                "id" serial not null
                    constraint "payment_id_pkey" primary key,
                "type" varchar not null,
                "status" varchar not null,
                "details" json not null,
                "amount" numeric not null,
                "currency" varchar not null,
                "transaction_id" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "payment_user_id_fkey" references "user",
                "company_id" integer not null
                    constraint "payment_company_id_fkey" references "company",
                "project_id" integer
                    constraint "payment_project_id_fkey" references "project"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "payment" cascade;
            drop index if exists "payment_ukey_name_user_id_company_id";
            drop index if exists "payment_ukey_name_user_id_project_id";
        `;
        await queryRunner.query(sql);
    }
}
