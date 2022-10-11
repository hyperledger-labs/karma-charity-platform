import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectCompanyPreferencesLocation16271212600170 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" rename column "location" to "city";
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" rename column "city" to "location";
        `;
        await queryRunner.query(sql);
    }
}
