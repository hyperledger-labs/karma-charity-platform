import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPreferences1627121260008 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "project_preferences"
            (
                "id" serial not null 
                    constraint "project_preferences_id_pkey" primary key,
                "project_id" integer
                    constraint "project_preferences_project_id_key" unique
                    constraint "project_preferences_project_id_fkey" references "project",
                "title" varchar not null,
                "description" varchar not null,
                "description_short" varchar not null,
       
                "tags" varchar array,
                "picture" varchar,
                "location" varchar,
                "latitude" numeric,
                "longitude" numeric
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "project_preferences" cascade;
        `;
        await queryRunner.query(sql);
    }
}
