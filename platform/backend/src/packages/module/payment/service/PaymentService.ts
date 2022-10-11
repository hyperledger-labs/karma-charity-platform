import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Transport } from '@ts-core/common';
import { IPaymentAggregatorData } from '@project/common/platform/payment';

@Injectable()
export class PaymentService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public getPaymentAggregatorApiKey(details: IPaymentAggregatorData): string {
        return null;
    }

}