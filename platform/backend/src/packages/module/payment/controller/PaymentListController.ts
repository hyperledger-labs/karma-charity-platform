import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { Payment } from '@project/common/platform/payment';
import { PaymentEntity } from '@project/module/database/payment';
import { COMPANY_URL, PAYMENT_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class PaymentListDto implements Paginable<Payment> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Payment>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Payment>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class PaymentListDtoResponse implements IPagination<Payment> {
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

@Controller(PAYMENT_URL)
export class PaymentListController extends DefaultController<PaymentListDto, PaymentListDtoResponse> {
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

    @Swagger({ name: 'Get payment list', response: PaymentListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: PaymentListDto, @Req() request: IUserHolder): Promise<PaymentListDtoResponse> {
        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.payment.createQueryBuilder('payment')
        //.innerJoinAndSelect('payment.preferences', 'preferences')
        //.leftJoinAndMapMany("payment.userRoles", UserRoleEntity, 'role', `role.userId = ${request.user.id} and role.paymentId = payment.id`)
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: PaymentEntity): Promise<Payment> => item.toObject();
}
