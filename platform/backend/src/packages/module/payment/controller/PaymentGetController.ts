import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { PaymentNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { COMPANY_URL, USER_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { IPaymentGetDtoResponse } from '@project/common/platform/api/payment';
import { PAYMENT_URL } from '@project/common/platform/api';
import { Payment } from '@project/common/platform/payment';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${PAYMENT_URL}/:id`)
export class PaymentGetController extends DefaultController<number, IPaymentGetDtoResponse> {
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

    @Swagger({ name: `Get payment by id`, response: Payment })
    @Get()
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder,): Promise<IPaymentGetDtoResponse> {
        // let item = await this.cache.wrap<LedgerBlock>(this.getCacheKey(params), () => this.getItem(params), {ttl: DateUtil.MILISECONDS_DAY / DateUtil.MILISECONDS_SECOND});

        let item = await this.getItem(id);
        return item;
    }

    private async getItem(id: number): Promise<Payment> {
        let item = await this.database.paymentGet(id);
        if (_.isNil(item)) {
            throw new PaymentNotFoundError();
        }
        return item.toObject();
    }
}
