import { Type } from 'class-transformer';
import { PaymentAccountId } from './PaymentAccountId';
import { Project } from '../project';
import { Company } from '../company';
import { CoinEmitType } from '../../transport/command/coin';
import { Payment } from '../payment';
import { LedgerCoinId } from '../../ledger/coin';

export class PaymentTransaction {
    id: number;
    type: PaymentTransactionType;

    // @Type(() => Payment)
    payment?: Payment;
    paymentId: number;

    @Type(() => Project)
    project?: Project;
    projectId?: number;

    @Type(() => Company)
    company?: Company;
    companyId?: number;

    amount: string;
    coinId: LedgerCoinId;
    ledgerTransaction: string;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    activatedDate: Date;

    debet: PaymentAccountId;
    credit: PaymentAccountId;
}

export type PaymentTransactionType = CoinEmitType;
