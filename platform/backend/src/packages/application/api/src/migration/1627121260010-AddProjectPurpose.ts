import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPurpose1627121260010 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "project_purpose"
            (
                "id" serial not null 
                    constraint "project_purpose_id_pkey" primary key,
                "project_id" integer
                    constraint "project_purpose_project_id_fkey" references "project",
                "name" varchar not null,
                "amount" numeric not null,
                "coin_id" varchar not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "project_purpose" cascade;
        `;
        await queryRunner.query(sql);
    }
}
