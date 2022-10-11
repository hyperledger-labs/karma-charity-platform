import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPreferencesIsUrgent16271212600090 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" add "is_urgent" boolean;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" delete "is_urgent";
        `;
        await queryRunner.query(sql);
    }
}
