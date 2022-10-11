import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPassword16271212600120 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "user" add "password" varchar;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "user" delete "password";
        `;
        await queryRunner.query(sql);
    }
}
