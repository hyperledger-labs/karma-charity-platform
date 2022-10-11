import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetProjectPreferencesLocationNotNull16271212600140 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            update "project_preferences" set "location" = 'Москва' where "location" is null;
            alter table "project_preferences" alter column "location" set not null;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" alter column "location" drop not null;
        `;
        await queryRunner.query(sql);
    }
}
