import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProject1627121260007 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "project"
            (
                "id" serial not null 
                    constraint "project_id_pkey" primary key,
                "ledger_uid" varchar
                    constraint "project_ledger_uid_ukey" unique,

                "company_id" integer 
                    constraint "project_company_id_fkey" references "company",
                    
                "user_id" integer 
                    constraint "user_company_id_fkey" references "user",

                "status" varchar not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "project" cascade;
        `;
        await queryRunner.query(sql);
    }
}
