import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { PaymentWidgetOpenCommand } from '../transport';
import { IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse } from '../transport';
import { PaymentService } from './PaymentService';

@Injectable({ providedIn: 'root' })
export class PaymentWidgetOpenHandler extends TransportCommandAsyncHandler<IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse, PaymentWidgetOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private api: Client, private service: PaymentService) {
        super(logger, transport, PaymentWidgetOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IPaymentWidgetOpenDto): Promise<IPaymentWidgetOpenDtoResponse> {
        return this.service.getAggregator(params.aggregator.type).open(params);
    }
}
