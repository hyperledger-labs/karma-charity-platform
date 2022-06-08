import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1611322356899 implements MigrationInterface {
    name = 'Generate1611322356899';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ledger_block_event" ADD "transaction_validation_code" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}
