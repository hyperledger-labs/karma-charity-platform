import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserHash16271212600130 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "user_hash"
            (                
                "id" serial not null
                    constraint "user_hash_id_pkey" primary key,
                "hash" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "user_hash_user_id_fkey" references "user",
                "initiator_id" integer
                    constraint "user_hash_initiator_id_fkey" references "user"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "user_hash" cascade;
        `;
        await queryRunner.query(sql);
    }
}
