import {MigrationInterface, QueryRunner} from "typeorm";

export class Generate1610102310812 implements MigrationInterface {
    name = 'Generate1610102310812'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ledger" ADD "is_batch" boolean`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
