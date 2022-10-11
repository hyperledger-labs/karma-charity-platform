import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPreferencesFinishedDate16271212600110 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" add "finished_date" timestamp;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" delete "finished_date";
        `;
        await queryRunner.query(sql);
    }
}
