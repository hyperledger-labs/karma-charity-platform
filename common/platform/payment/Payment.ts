
import { Type } from 'class-transformer';
import { PaymentTransaction } from './PaymentTransaction';
import { User } from '../user';
import { PaymentAggregatorType } from './aggregator';

export class Payment {
    id: number;
    type: PaymentAggregatorType
    status: PaymentStatus;
    transactionId: string;

    @Type(() => PaymentTransaction)
    transactions: Array<PaymentTransaction>;

    userId?: number;
    details?: any;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    updatedDate: Date;

    user?: User;
}

export enum PaymentStatus {
    COMPLETED = 'COMPLETED',
    AUTHORIZED = 'AUTHORIZED',
}