
import { Controller, Req, Param, Post, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { ValidateUtil } from '@ts-core/common/util';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { DatabaseService } from '@project/module/database/service';
import { UserType } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { ICompanyVerifyDtoResponse } from '@project/common/platform/api/company';
import { CompanyStatus, COMPANY_VERIFY_STATUS, COMPANY_VERIFY_TYPE } from '@project/common/platform/company';
import { Company } from '@project/common/platform/company';
import { CompanyUndefinedError, RequestInvalidError } from '@project/module/core/middleware';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';

@Controller(`${COMPANY_URL}/:id/verify`)
export class CompanyVerifyController extends DefaultController<number, ICompanyVerifyDtoResponse> {
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

    @Swagger({ name: 'Company verify', response: Company })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: COMPANY_VERIFY_TYPE })
    public async executeExtended(@Param('id', ParseIntPipe) companyId: number, @Req() request: IUserHolder): Promise<ICompanyVerifyDtoResponse> {
        let item = await this.database.companyGet(companyId);

        let companyStatus = COMPANY_VERIFY_STATUS;
        UserGuard.checkCompany({ isCompanyRequired: true, companyStatus }, item);

        item = await this.database.companyStatus(item, CompanyStatus.VERIFIED);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}

