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
import { PaymentEntity } from '@project/module/database/payment';
import { COMPANY_PUBLIC_URL, PAYMENT_PUBLIC_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { IPaymentPublicListDto, IPaymentPublicListDtoResponse } from '@project/common/platform/api/payment';
import { Payment, PaymentTransaction } from '@project/common/platform/payment';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class PaymentPublicListDto implements IPaymentPublicListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Payment>;

    @ApiPropertyOptional()
    conditionsExtras?: FilterableConditions<PaymentTransaction>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Payment>;

    @ApiPropertyOptional()
    sortExtras?: FilterableSort<PaymentTransaction>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class PaymentPublicListDtoResponse implements IPaymentPublicListDtoResponse {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: Payment })
    items: Array<Payment>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PAYMENT_PUBLIC_URL)
export class PaymentPublicListController extends DefaultController<PaymentPublicListDto, PaymentPublicListDtoResponse> {
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

    @Swagger({ name: 'Get payment public list', response: PaymentPublicListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: PaymentPublicListDto): Promise<PaymentPublicListDtoResponse> {
        let query = this.database.payment.createQueryBuilder('payment');
        this.database.addPaymentRelations(query);

        query.leftJoinAndSelect('payment.transactions', 'paymentTransaction');

        if (!_.isEmpty(params.conditionsExtras)) {
            TypeormUtil.applyConditions(query, params.conditionsExtras, 'paymentTransaction');
        }
        if (!_.isEmpty(params.sortExtras)) {
            TypeormUtil.applySort(query, params.sortExtras, 'paymentTransaction');
        }
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: PaymentEntity): Promise<Payment> => item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
