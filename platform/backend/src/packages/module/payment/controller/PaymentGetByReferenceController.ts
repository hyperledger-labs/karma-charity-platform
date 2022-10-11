import { Controller, Param, Req, Get } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { PaymentNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { PAYMENT_REFERENCE_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { IPaymentGetDtoResponse } from '@project/common/platform/api/payment';
import { Payment } from '@project/common/platform/payment';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${PAYMENT_REFERENCE_URL}/:id`)
export class PaymentGetByReferenceController extends DefaultController<number, IPaymentGetDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: `Get payment by reference id`, response: Payment })
    @Get()
    public async executeExtends(@Param('id') referenceId: string, @Req() request: IUserHolder): Promise<IPaymentGetDtoResponse> {
        let item = await this.database.paymentGetByReference(referenceId);
        if (_.isNil(item)) {
            throw new PaymentNotFoundError();
        }
        return item.toObject();
    }

}
