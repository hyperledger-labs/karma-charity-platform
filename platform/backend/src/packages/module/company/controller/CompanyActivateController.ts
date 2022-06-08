import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserCompany, UserType } from '@project/common/platform/user';
import { COMPANY_ACTIVATE_URL } from '@project/common/platform/api';
import { CompanyStatus } from '@project/common/platform/company';
import { ICompanyActivateDtoResponse } from '@project/common/platform/api/company';
import { CompanyEntity } from '@project/module/database/company';
import { LedgerCompany, LedgerCompanyStatus } from '@project/common/ledger/company';
import { TraceUtil } from '@ts-core/common/trace';
import { LedgerCompanyRole } from '@project/common/ledger/role';

@Controller(COMPANY_ACTIVATE_URL)
export class CompanyActivateController extends DefaultController<number, ICompanyActivateDtoResponse> {
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
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async createInLedger(company: CompanyEntity): Promise<LedgerCompany> {
        let item = LedgerCompany.create(new Date(), _.padStart('1', 64, '1'));
        item.status = LedgerCompanyStatus.ACTIVE;
        item.createdDate = new Date();
        item.description = company.preferences.name;
        return item;
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
        type: [UserType.COMPANY_MANAGER],
        company: {
            required: true,
            status: [CompanyStatus.VERIFIED],
            role: [LedgerCompanyRole.COMPANY_MANAGER]
        }
    })
    public async executeExtended(@Req() request: IUserHolder): Promise<ICompanyActivateDtoResponse> {
        let company = request.company;
        company.status = CompanyStatus.ACTIVE;

        let ledger = await this.createInLedger(company);
        company.ledgerUid = ledger.uid;

        await ValidateUtil.validate(company);
        await this.database.company.save(company);
        return company.toUserObject();
    }
}
