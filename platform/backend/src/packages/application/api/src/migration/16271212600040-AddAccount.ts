import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccount16271212600040 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "account"
            (                
                "id" serial not null
                    constraint "account_id_pkey" primary key,
                "type" varchar not null,
                "amount" varchar not null,
                "coin_id" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "company_id" integer
                    constraint "account_company_id_fkey" references "company",
                "project_id" integer
                    constraint "account_project_id_fkey" references "project"
            );

            create index "account_ukey_type_coin_id_company_id" on account (type, coin_id, company_id);
            create index "account_ukey_type_coin_id_project_id" on account (type, coin_id, project_id);
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "account" cascade;
            drop index if exists "account_ukey_type_coinId_company_id";
            drop index if exists "account_ukey_type_coinId_project_id";
        `;
        await queryRunner.query(sql);
    }
}
