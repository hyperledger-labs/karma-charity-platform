import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompany1627121250000 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "company"
            (
                "id" serial not null 
                    constraint "company_id_pkey" primary key,
                "ledger_uid" varchar
                    constraint "company_ledger_uid_ukey" unique,
                "status" varchar not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "company" cascade;
        `;
        await queryRunner.query(sql);
    }
}
