import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCompanyPreferencesLocation16271212600160 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "company_preferences" rename column "location" to "city";
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "company_preferences" rename column "city" to "location";
        `;
        await queryRunner.query(sql);
    }
}
