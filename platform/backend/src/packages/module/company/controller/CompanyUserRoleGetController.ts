import { Controller, Get, ParseIntPipe, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserCompany, UserType } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { ICompanyUserRoleGetDtoResponse } from '@project/common/platform/api/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';

@Controller(`${COMPANY_URL}/:companyId/role/:userId`)
export class CompanyUserRoleGetController extends DefaultController<void, ICompanyUserRoleGetDtoResponse> {
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

    @Swagger({ name: 'Get company user roles list', response: UserCompany })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER]
    })
    public async executeExtended(@Param('companyId', ParseIntPipe) companyId: number, @Param('userId', ParseIntPipe) userId: number, @Req() request: IUserHolder): Promise<ICompanyUserRoleGetDtoResponse> {
        let user = request.user;
        let company = request.company;

        if (user.type !== UserType.ADMINISTRATOR) {
            UserGuard.checkCompany({ isCompanyRequired: true, companyRole: [LedgerCompanyRole.COMPANY_MANAGER] }, company);
            companyId = company.id;
        }

        company = await this.database.companyGet(companyId, userId);
        return company.toUserObject().roles as Array<LedgerCompanyRole>;
    }
}
