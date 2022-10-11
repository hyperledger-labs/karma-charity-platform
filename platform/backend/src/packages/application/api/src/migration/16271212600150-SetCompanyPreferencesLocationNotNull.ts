import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetCompanyPreferencesLocationNotNull16271212600150 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            update "company_preferences" set "location" = 'Москва' where "location" is null;
            alter table "company_preferences" alter column "location" set not null;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "company_preferences" alter column "location" drop not null;
        `;
        await queryRunner.query(sql);
    }
}
