import { Type } from 'class-transformer';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { PaymentAccountId } from './PaymentAccountId';
import { Project } from '../project';
import { Company } from '../company';
import { CoinEmitType } from '../../transport/command/coin';

export class PaymentTransaction {
    id: number;
    type: PaymentTransactionType;
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
