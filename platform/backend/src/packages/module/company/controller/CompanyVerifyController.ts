
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
import { CompanyStatus } from '@project/common/platform/company';
import { Company } from '@project/common/platform/company';
import { CompanyUndefinedError, RequestInvalidError } from '@project/module/core/middleware';
import { IUserHolder } from '@project/module/database/user';

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
    @UserGuardOptions({ type: [UserType.EDITOR, UserType.ADMINISTRATOR] })
    public async executeExtended(@Param('id', ParseIntPipe) companyId: number, @Req() request: IUserHolder): Promise<ICompanyVerifyDtoResponse> {
        let company = await this.database.companyGet(companyId);
        UserGuard.checkCompany({
            isCompanyRequired: true,
            companyStatus: [CompanyStatus.VERIFICATION_PROCESS]
        }, company);

        company = await this.database.companyStatus(company, CompanyStatus.VERIFIED);
        return company.toObject();
    }
}

