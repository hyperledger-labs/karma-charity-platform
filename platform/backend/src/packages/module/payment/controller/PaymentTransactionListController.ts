import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { PaymentTransaction } from '@project/common/platform/payment';
import { PaymentTransactionEntity } from '@project/module/database/payment';
import { PAYMENT_TRANSACTION_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { IPaymentTransactionListDto, IPaymentTransactionTarget } from '@project/common/platform/api/payment';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class PaymentTransactionListDto implements IPaymentTransactionListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<PaymentTransaction>;

    @ApiPropertyOptional()
    conditionsExtras?: FilterableConditions<IPaymentTransactionTarget>;

    @ApiPropertyOptional()
    sort?: FilterableSort<PaymentTransaction>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class PaymentTransactionListDtoResponse implements IPagination<PaymentTransaction> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: PaymentTransaction })
    items: Array<PaymentTransaction>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PAYMENT_TRANSACTION_URL)
export class PaymentTransactionListController extends DefaultController<PaymentTransactionListDto, PaymentTransactionListDtoResponse> {
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

    @Swagger({ name: 'Get payment transaction list', response: PaymentTransactionListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: PaymentTransactionListDto, @Req() request: IUserHolder): Promise<PaymentTransactionListDtoResponse> {
        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.paymentTransaction.createQueryBuilder('paymentTransaction');
        this.database.addPaymentTransactionRelations(query);

        let title = _.get(params, 'conditionsExtras.title');
        if (!_.isNil(title)) {
            query.where("companyPreferences.title like :title OR projectPreferences.title like :title", { title: `%${title}%` });
        }

        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: PaymentTransactionEntity): Promise<PaymentTransaction> => item.toObject();
}
