"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate1610102310812 = void 0;
class Generate1610102310812 {
    name = 'Generate1610102310812';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ledger" ADD "is_batch" boolean`, undefined);
    }
    async down(queryRunner) {
    }
}
exports.Generate1610102310812 = Generate1610102310812;
