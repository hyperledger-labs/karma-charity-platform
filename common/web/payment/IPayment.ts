import { PaymentType, PaymentStatus } from '.';

export interface IPayment {
    id: number;
    amount: number;
    type: PaymentType;
    status: PaymentStatus;
    externalId?: string;
    projectId?: number;
    companyId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentExtended extends IPayment {
    ledgerTxHash?: string;
}
