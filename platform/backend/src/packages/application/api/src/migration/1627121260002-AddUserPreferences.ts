import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferences1627121260002 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "user_preferences"
            (
                "id" serial not null 
                    constraint "user_preferences_id_pkey" primary key,
                "user_id" integer
                    constraint "user_preferences_user_id_key" unique
                    constraint "user_preferences_user_id_fkey" references "user",
                "name" varchar not null,
                "phone" varchar,
                "email" varchar,
                "locale" varchar,
                "picture" varchar,
                "birthday" timestamp,
                "description" varchar,
                "is_male" boolean,
                "location" varchar,
                "latitude" numeric,
                "longitude" numeric,
                "project_cancel_strategy" varchar
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "user_preferences" cascade;
        `;
        await queryRunner.query(sql);
    }
}
