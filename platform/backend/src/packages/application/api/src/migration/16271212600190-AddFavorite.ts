import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavorite16271212600190 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "favorite"
            (                
                "id" serial not null
                    constraint "favorite_id_pkey" primary key,

                "status" varchar not null,

                "object_id" integer not null,
                "object_type" varchar not null,

                "user_id" integer not null
                    constraint "favorite_user_id_fkey" references "user",

                "project_id" integer
                    constraint "favorite_project_id_fkey" references "project",

                "company_id" integer
                    constraint "favorite_company_id_fkey" references "company",

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );

            create unique index "favorite_ukey_user_id_object_id_object_type" on "favorite" (user_id, object_id, object_type);
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "favorite" cascade;
            drop index if exists "favorite_ukey_user_id_object_id_object_type";
        `;
        await queryRunner.query(sql);
    }
}
