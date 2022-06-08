import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { ExtendedError } from '@ts-core/common/error';
import { Logger } from '@ts-core/common/logger';
import { ValidateUtil } from '@ts-core/common/util';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserCompany, UserType } from '@project/common/platform/user';
import { COMPANY_TO_VERIFY_URL } from '@project/common/platform/api';
import { ICompanyToVerifyDtoResponse } from '@project/common/platform/api/company';
import { CompanyStatus } from '@project/common/platform/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';

@Controller(COMPANY_TO_VERIFY_URL)
export class CompanyToVerifyController extends DefaultController<number, ICompanyToVerifyDtoResponse> {
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

    @Swagger({ name: 'Company to verify', response: UserCompany })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.COMPANY_MANAGER],
        company: {
            required: true,
            status: [CompanyStatus.DRAFT, CompanyStatus.REJECTED],
            role: [LedgerCompanyRole.PROJECT_MANAGER]
        }
    })
    public async executeExtended(@Req() request: IUserHolder): Promise<ICompanyToVerifyDtoResponse> {
        let company = request.company;
        
        company = await this.database.companyStatus(company, CompanyStatus.VERIFICATION_PROCESS);
        return company.toUserObject();
    }
}
