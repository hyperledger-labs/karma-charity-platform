import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPreferencesActivatedDate16271212600100 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" add "activated_date" timestamp;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "project_preferences" delete "activated_date";
        `;
        await queryRunner.query(sql);
    }
}
