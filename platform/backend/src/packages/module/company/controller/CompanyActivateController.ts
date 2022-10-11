import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder, UserEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserCompany } from '@project/common/platform/user';
import { COMPANY_ACTIVATE_URL } from '@project/common/platform/api';
import { COMPANY_ACTIVATE_ROLE, COMPANY_ACTIVATE_STATUS, CompanyStatus, COMPANY_ACTIVATE_TYPE } from '@project/common/platform/company';
import { ICompanyActivateDtoResponse } from '@project/common/platform/api/company';
import { CompanyEntity } from '@project/module/database/company';
import { TransformGroup } from '@project/module/database';
import { LedgerService } from '@project/module/ledger/service';

@Controller(COMPANY_ACTIVATE_URL)
export class CompanyActivateController extends DefaultController<number, ICompanyActivateDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private ledger: LedgerService) {
        super(logger);
    }


    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Company to activate', response: UserCompany })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: COMPANY_ACTIVATE_TYPE,
        company: {
            role: COMPANY_ACTIVATE_ROLE,
            status: COMPANY_ACTIVATE_STATUS,
            required: true
        }
    })
    public async executeExtended(@Req() request: IUserHolder): Promise<ICompanyActivateDtoResponse> {
        let item = await this.ledger.companyAdd(request.user.ledgerUid, request.company);

        await this.database.companyStatus(item, CompanyStatus.ACTIVE);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
