import { TransportCommand } from '@ts-core/common';
import { IPaymentAggregatorData } from '@project/common/platform/payment';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PaymentStatus } from '@project/common/platform/payment';

export class PaymentPayCommand extends TransportCommand<IPaymentPayDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'PaymentPayCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IPaymentPayDto) {
        super(PaymentPayCommand.NAME, request);
        
    }
}

export interface IPaymentPayDto<T = any> {
    data: T;

    type: PaymentAggregatorType;
    status: PaymentStatus;
    details: IPaymentAggregatorData;
    transactionId: string;
}
