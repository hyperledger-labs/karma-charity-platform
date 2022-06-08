import { Controller, Query, Req, Get, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { IPaymentAggregatorGetDto, IPaymentAggregatorGetDtoResponse } from '@project/common/platform/api/payment';
import { PaymentAggregator, PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { ValidateNested, IsEnum, IsNumber, IsOptional, IsDefined, IsString } from 'class-validator';
import { CoinObject, CoinObjectType } from '@project/common/transport/command/coin';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { PAYMENT_AGGREGATOR_URL } from '@project/common/platform/api';
import { CloudPaymentsCurrency } from '@project/common/platform/payment/aggregator/cloudpayments';
import { Type } from 'class-transformer';
import { PaymentUtil } from '../util';
import { PaymentTarget } from '@project/common/platform/payment';
import { CompanyEntity } from '@project/module/database/company';
import { ProjectEntity } from '@project/module/database/project';
import { UnreachableStatementError } from '@ts-core/common/error';
import { IUserHolder } from '@project/module/database/user';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class PaymentAggregatorGetDto implements IPaymentAggregatorGetDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    id: number;

    @ApiProperty()
    @IsEnum(CoinObjectType)
    type: CoinObjectType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class PaymentAggregatorGetDtoResponse implements IPaymentAggregatorGetDtoResponse {
    @ApiProperty()
    @IsDefined()
    aggregator: Partial<PaymentAggregator>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    amount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({}, { each: true })
    amounts?: Array<number>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    currencies?: Array<string>;

    @ApiProperty()
    @Type(() => PaymentTarget)
    @IsDefined()
    @ValidateNested()
    target: PaymentTarget;

    @ApiProperty()
    @IsString()
    details: string;;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PAYMENT_AGGREGATOR_URL)
export class PaymentAggregatorGetController extends DefaultController<IPaymentAggregatorGetDto, IPaymentAggregatorGetDtoResponse> {
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

    @Swagger({ name: 'Get payment aggregator by project or company', response: PaymentAggregatorGetDtoResponse, isDisableBearer: true })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Query() params: PaymentAggregatorGetDto, @Req() request: IUserHolder): Promise<IPaymentAggregatorGetDtoResponse> {
        let target: CompanyEntity | ProjectEntity = null;
        let company: CompanyEntity = null;
        switch (params.type) {
            case CoinObjectType.COMPANY:
                target = company = await this.database.companyGet(params.id);
                UserGuard.checkCompany({ isCompanyRequired: true }, target);
                break;
            case CoinObjectType.PROJECT:
                target = await this.database.projectGet(params.id);
                UserGuard.checkProject({ isProjectRequired: true }, target);
                company = target.company;
                break;
            default:
                throw new UnreachableStatementError(params.type);
        }

        let item: IPaymentAggregatorGetDtoResponse = {
            amount: 1000,
            amounts: [10, 50, 100, 500, 1000],
            currency: CloudPaymentsCurrency.RUB,
            currencies: Object.values(CloudPaymentsCurrency),

            target: {
                id: params.id,
                type: params.type,
                value: target.toObject()
            },
            details: PaymentUtil.createDetails({ target: params, userId: request.user.id }),
            aggregator: company.paymentAggregator.toObject(),
        }
        return item;
    }
}
