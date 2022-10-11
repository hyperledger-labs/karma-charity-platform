import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferencesUpdatedDate16271212600210 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "user_preferences" add "updated_date" timestamp default now();
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "user_preferences" delete "updated_date";
        `;
        await queryRunner.query(sql);
    }
}
