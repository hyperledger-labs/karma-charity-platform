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
import { CompanyStatus, COMPANY_TO_VERIFY_ROLE, COMPANY_TO_VERIFY_STATUS, COMPANY_TO_VERIFY_TYPE } from '@project/common/platform/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { TransformGroup } from '@project/module/database';

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
        type: COMPANY_TO_VERIFY_TYPE,
        company: {
            role: COMPANY_TO_VERIFY_ROLE,
            status: COMPANY_TO_VERIFY_STATUS,
            required: true,
        }
    })
    public async executeExtended(@Req() request: IUserHolder): Promise<ICompanyToVerifyDtoResponse> {
        let item = request.company;
        
        item = await this.database.companyStatus(item, CompanyStatus.VERIFICATION_PROCESS);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
