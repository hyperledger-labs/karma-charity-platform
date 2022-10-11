import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferencesNews16271212600180 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "user_preferences" add "is_need_platform_news" boolean;
            alter table "user_preferences" add "is_need_platform_notifications" boolean;
            alter table "user_preferences" add "is_need_favorites_notifications" boolean;
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            alter table "user_preferences" delete "is_need_platform_news";
            alter table "user_preferences" delete "is_need_platform_notifications";
            alter table "user_preferences" delete "is_need_favorites_notifications";
        `;
        await queryRunner.query(sql);
    }
}
