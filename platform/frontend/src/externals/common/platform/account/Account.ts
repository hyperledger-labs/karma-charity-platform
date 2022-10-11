import { LedgerCoinId } from '../../ledger/coin';
import { Type } from 'class-transformer';

export class Account {
    id: number;
    type: AccountType;
    amount: string;
    coinId: LedgerCoinId;
    companyId?: number;
    projectId?: number;

    @Type(() => Date)
    createdDate: Date;
    @Type(() => Date)
    updatedDate: Date;
}

export type Accounts = {
    [key in LedgerCoinId]: string;
}

export enum AccountType {
    REQUIRED = 'REQUIRED',
    COLLECTED = 'COLLECTED',
}