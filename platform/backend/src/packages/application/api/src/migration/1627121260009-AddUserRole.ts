import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1627121260009 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "user_role"
            (                
                "id" serial not null
                    constraint "user_role_id_pkey" primary key,
                "name" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "user_role_user_id_fkey" references "user",
                "company_id" integer
                    constraint "user_role_company_id_fkey" references "company",
                "project_id" integer
                    constraint "user_role_project_id_fkey" references "project"
            );

            create index "user_role_ukey_name_user_id_company_id" on user_role (name, user_id, company_id);
            create index "user_role_ukey_name_user_id_project_id" on user_role (name, user_id, project_id);
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "user_role" cascade;
            drop index if exists "user_role_ukey_name_user_id_company_id";
            drop index if exists "user_role_ukey_name_user_id_project_id";
        `;
        await queryRunner.query(sql);
    }
}
