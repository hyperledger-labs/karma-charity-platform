import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Transport } from '@ts-core/common/transport';
import { IPaymentAggregatorData } from '../util';

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
        return '484fad603e581acc459923ac9476e4b9';
    }

}