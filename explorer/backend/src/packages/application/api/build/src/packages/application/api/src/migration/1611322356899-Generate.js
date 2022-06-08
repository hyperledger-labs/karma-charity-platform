"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate1611322356899 = void 0;
class Generate1611322356899 {
    name = 'Generate1611322356899';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_block_event" ADD "transaction_validation_code" integer`, undefined);
    }
    async down(queryRunner) { }
}
exports.Generate1611322356899 = Generate1611322356899;
