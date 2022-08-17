import { ITraceable } from '@ts-core/common';
import { IPaymentTarget, PaymentTarget } from '../../payment';
import { PaymentAggregator } from '../../payment/aggregator';

export interface IPaymentAggregatorGetDto extends IPaymentTarget, ITraceable { }

export interface IPaymentAggregatorGetDtoResponse {
    target: PaymentTarget;
    details: string;
    aggregator: Partial<PaymentAggregator>;

    amount?: number;
    amounts?: Array<number>;

    coinId?: string;
    coinIds?: Array<string>;
}
