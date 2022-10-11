import { Controller, Get, ParseIntPipe, Param, Query } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { PROJECT_URL } from '@project/common/platform/api';
import { PaymentTransactionListDto, PaymentTransactionListDtoResponse } from '@project/module/payment/controller';
import { PaymentTransactionEntity } from '@project/module/database/payment';
import { PaymentTransaction } from '@project/common/platform/payment';
import { CoinEmitType } from '@project/common/transport/command/coin';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${PROJECT_URL}/:id/paymentTransaction`)
export class ProjectPaymentTransactionListController extends DefaultController<PaymentTransactionListDto, PaymentTransactionListDtoResponse> {
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

    @Swagger({ name: 'Get project users list', response: PaymentTransactionListDtoResponse })
    @Get()
    public async executeExtended(@Param('id', ParseIntPipe) id: number, @Query({ transform: Paginable.transform }) params: PaymentTransactionListDto): Promise<PaymentTransactionListDtoResponse> {
        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.paymentTransaction.createQueryBuilder('paymentTransaction')
            .leftJoinAndSelect('paymentTransaction.payment', 'payment')
            .where('paymentTransaction.projectId = :projectId', { projectId: id })
            .andWhere('paymentTransaction.type = :type', { type: CoinEmitType.DONATED })
            .andWhere('paymentTransaction.activatedDate IS NOT NULL');

        this.database.addPaymentRelations(query);
        return TypeormUtil.toPagination(query, params as any, this.transform);
    }

    protected transform = async (item: PaymentTransactionEntity): Promise<PaymentTransaction> => item.toObject();
}
