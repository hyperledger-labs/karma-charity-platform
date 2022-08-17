import { ILedgerAction } from "./ILedgerAction";
import { Type } from 'class-transformer';

export class ILedgerTransaction {
    uid: string;
    hash: string;
    blockNumber: number;
    isBatch?: boolean;
    blockMined?: number;

    @Type(() => Date)
    createdDate: Date;

    requestName: string;
    validationCode: number;
    responseErrorCode: number;

    @Type(() => ILedgerAction)
    actions: Array<ILedgerAction>;
}



