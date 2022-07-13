import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFile16271212600050 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "file"
            (                
                "id" serial not null
                    constraint "file_id_pkey" primary key,
                "uid" varchar not null,
                "name" varchar not null,
                "path" varchar not null,
                "size" integer not null,

                "type" varchar not null,
                "link_id" integer not null,
                "link_type" varchar not null,

                "mime" varchar not null,
                "extension" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );
        `;

        // create index "file_ukey_type_link_id_link_type" on file (type, link_id, link_type);
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "file" cascade;
            drop index if exists "file_ukey_type_link_id_link_type";
        `;
        await queryRunner.query(sql);
    }
}
