import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1627121260000 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "user"
            (
                "id" serial not null 
                    constraint "user_id_pkey" primary key,
                "uid" varchar not null 
                    constraint "user_uid_ukey" unique,
                "login" varchar not null 
                    constraint "user_login_ukey" unique,
                "ledger_uid" varchar
                    constraint "user_ledger_uid_ukey" unique,
                "company_id" integer 
                    constraint "user_company_id_fkey" references "company",
                "resource" varchar not null,
                "type" varchar not null,
                "status" varchar not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "user" cascade;
        `;
        await queryRunner.query(sql);
    }
}
