import { Logger, LoggerWrapper } from '@ts-core/common';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PaymentAggregatorManager } from '../lib';
import { CloudPaymentsAggregator } from '../lib/aggregator';
import { NativeWindowService } from '@ts-core/frontend';

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

    constructor(logger: Logger, nativeWindow: NativeWindowService) {
        super(logger);
        this.aggregators = new Map();
        this.aggregators.set(PaymentAggregatorType.CLOUD_PAYMENTS, new CloudPaymentsAggregator(nativeWindow));
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