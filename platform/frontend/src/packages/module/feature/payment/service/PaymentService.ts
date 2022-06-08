import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { Transport } from '@ts-core/common/transport';
import { Injectable } from '@angular/core';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PaymentAggregatorManager } from '../lib';
import { CloudPaymentsAggregator } from '../lib/aggregator';

@Injectable({ providedIn: 'root' })
export class PaymentService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private aggregators: Map<PaymentAggregatorType, PaymentAggregatorManager>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport) {
        super(logger);
        this.aggregators = new Map();
        this.aggregators.set(PaymentAggregatorType.CLOUD_PAYMENTS, new CloudPaymentsAggregator());
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public getAggregator(type: PaymentAggregatorType): PaymentAggregatorManager {
        return this.aggregators.get(type);
    }
}