import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCity16271212600200 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "city"
            (                
                "id" serial not null
                    constraint "city_id_pkey" primary key,
                "name" varchar not null
            );

            create unique index "city_ukey_name" on "city" (name);
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "city" cascade;
            drop index if exists "city_ukey_name";
        `;
        await queryRunner.query(sql);
    }
}
