import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCryptoKey1627121260006 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "user_crypto_key"
            (                
                "id" serial not null
                    constraint "user_crypto_key_id_pkey" primary key,
                "status" varchar not null,
                "algorithm" varchar not null,
                "public_key" varchar not null,
                "private_key" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "user_crypto_key_user_id_fkey" references "user"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "user_crypto_key" cascade;
        `;
        await queryRunner.query(sql);
    }
}
