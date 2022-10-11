import { Body, Controller, Param, Put, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil } from '@ts-core/common';
import { ICompanyEditDto, ICompanyEditDtoResponse } from '@project/common/platform/api/company';
import { Company, CompanyPreferences, CompanyStatus, COMPANY_EDIT_ROLE, COMPANY_EDIT_STATUS } from '@project/common/platform/company';
import { COMPANY_URL } from '@project/common/platform/api';
import { PaymentAggregator } from '@project/common/platform/payment/aggregator';
import { TransformGroup } from '@project/module/database';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class CompanyEditDto implements ICompanyEditDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(CompanyStatus)
    status?: CompanyStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDefined()
    preferences?: Partial<CompanyPreferences>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDefined()
    paymentAggregator?: Partial<PaymentAggregator>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${COMPANY_URL}/:id`)
export class CompanyEditController extends DefaultController<ICompanyEditDto, ICompanyEditDtoResponse> {
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

    @Swagger({ name: 'Company edit', response: Company })
    @Put()
    @UseGuards(UserGuard)
    public async executeExtended(@Param('id', ParseIntPipe) companyId: number, @Body() params: CompanyEditDto, @Req() request: IUserHolder): Promise<ICompanyEditDtoResponse> {
        let user = request.user;
        let item = await this.database.companyGet(companyId, user);

        let companyRole = !user.isAdministrator ? COMPANY_EDIT_ROLE : null;
        let companyStatus = !user.isAdministrator ? COMPANY_EDIT_STATUS : null;
        UserGuard.checkCompany({ isCompanyRequired: true, companyStatus, companyRole }, item);

        if (!_.isNil(params.preferences) && !_.isNil(params.preferences.founded)) {
            params.preferences.founded = new Date(params.preferences.founded);
        }

        ObjectUtil.copyPartial(params.preferences, item.preferences);
        ObjectUtil.copyPartial(params.paymentAggregator, item.paymentAggregator);
        if (user.isAdministrator && !_.isNil(params.status)) {
            item.status = params.status;
        }

        item = await this.database.company.save(item);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
