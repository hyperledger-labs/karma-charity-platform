import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayment16271212600030 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "payment"
            (                
                "id" serial not null
                    constraint "payment_id_pkey" primary key,
                "type" varchar not null,
                "details" json not null,
                "status" varchar not null,
                "transaction_id" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "payment_user_id_fkey" references "user"
            );
        `;
        await queryRunner.query(sql);
    }

    
    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "payment" cascade;
            drop index if exists "payment_user_id_fkey";
        `;
        await queryRunner.query(sql);
    }
}
