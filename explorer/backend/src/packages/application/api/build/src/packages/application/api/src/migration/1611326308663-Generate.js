"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate1611326308663 = void 0;
class Generate1611326308663 {
    name = 'Generate1611326308663';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_block" ADD "is_batch" boolean`, undefined);
    }
    async down(queryRunner) { }
}
exports.Generate1611326308663 = Generate1611326308663;
