"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate1610372054470 = void 0;
class Generate1610372054470 {
    name = 'Generate1610372054470';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger_block_transaction" RENAME COLUMN "block_batched" TO "block_mined"`, undefined);
    }
    async down(queryRunner) { }
}
exports.Generate1610372054470 = Generate1610372054470;
