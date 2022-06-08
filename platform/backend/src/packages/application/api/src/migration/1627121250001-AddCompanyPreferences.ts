import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyPreferences1627121250001 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "company_preferences"
            (
                "id" serial not null 
                    constraint "company_preferences_id_pkey" primary key,
                "company_id" integer
                    constraint "company_preferences_company_id_key" unique
                    constraint "company_preferences_company_id_fkey" references "company",
                "title" varchar not null,
                "ceo" varchar not null,
                "inn" varchar not null,
                "kpp" varchar not null,
                "ogrn" varchar not null,
                "name" varchar not null,
                "name_short" varchar not null,
                "address" varchar not null,
                "founded" timestamp not null,
       
                "phone" varchar,
                "email" varchar,
                "picture" varchar,
                "website" varchar,
                "location" varchar,
                "latitude" numeric,
                "longitude" numeric,
                "address_post" varchar
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "company_preferences" cascade;
        `;
        await queryRunner.query(sql);
    }
}
