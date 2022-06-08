
import { TransportCommandAsync } from '@ts-core/common/transport';
import { PaymentTarget } from '@common/platform/payment';
import { PaymentAggregator } from '@project/common/platform/payment/aggregator';

export class PaymentWidgetOpenCommand extends TransportCommandAsync<IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'PaymentWidgetOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IPaymentWidgetOpenDto) {
        super(PaymentWidgetOpenCommand.NAME, request);
    }
}

export interface IPaymentWidgetOpenDto {
    target: PaymentTarget;
    details: string;
    aggregator: Partial<PaymentAggregator>;

    amount: number;
    coinId: string;
}
export interface IPaymentWidgetOpenDtoResponse { }

export enum PaymentWidgetOpenResult {
    ERRORED = 'ERRORED',
    COMPLETED = 'COMPLETED',
}
