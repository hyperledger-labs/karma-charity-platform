import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1611326308663 implements MigrationInterface {
    name = 'Generate1611326308663';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ledger_block" ADD "is_batch" boolean`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}
