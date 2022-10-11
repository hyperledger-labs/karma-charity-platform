import { Controller, Query, Req, Get, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { IPaymentAggregatorGetDto, IPaymentAggregatorGetDtoResponse } from '@project/common/platform/api/payment';
import { PaymentAggregator } from '@project/common/platform/payment/aggregator';
import { ValidateNested, IsEnum, IsNumber, IsOptional, IsDefined, IsString } from 'class-validator';
import { CoinObjectType } from '@project/common/transport/command/coin';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { PAYMENT_AGGREGATOR_URL } from '@project/common/platform/api';
import { CloudPaymentsCurrency } from '@project/common/platform/payment/aggregator/cloudpayments';
import { Type } from 'class-transformer';
import { PaymentTarget, PaymentUtil } from '@project/common/platform/payment';
import { CompanyEntity } from '@project/module/database/company';
import { ProjectEntity } from '@project/module/database/project';
import { UnreachableStatementError } from '@ts-core/common';
import { IUserHolder } from '@project/module/database/user';
import { Transport } from '@ts-core/common';
import { CryptoDecryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';

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
    coinId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    coinIds?: Array<string>;

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

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService) {
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
    @UserGuardOptions({
        required: false
    })
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

                company = await this.database.companyGet(target.companyId);
                break;
            default:
                throw new UnreachableStatementError(params.type);
        }

        UserGuard.checkCompany({ isCompanyRequired: true }, company);

        let userId = !_.isNil(request.user) ? request.user.id : null;
        let privateKey = await this.transport.sendListen(new CryptoDecryptCommand({ type: CryptoKeyType.DATABASE, value: company.paymentAggregator.key }));
        let item: IPaymentAggregatorGetDtoResponse = {
            amount: 1000,
            amounts: [10, 50, 100, 500, 1000],
            coinId: CloudPaymentsCurrency.RUB,
            coinIds: Object.values(CloudPaymentsCurrency),

            target: {
                id: params.id,
                type: params.type,
                value: target.toObject()
            },
            details: PaymentUtil.createDetails(params, privateKey, userId),
            aggregator: company.paymentAggregator.toObject(),
        }
        return item;
    }
}
