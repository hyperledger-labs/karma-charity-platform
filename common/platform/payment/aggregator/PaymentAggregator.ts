export class PaymentAggregator {
    uid: string;
    type: PaymentAggregatorType;
    callbackUrl?: string;
}

export enum PaymentAggregatorType {
    CLOUD_PAYMENTS = 'CLOUD_PAYMENTS'
}

