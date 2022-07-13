import { Controller, Get, ParseIntPipe, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { UserCompany } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { ICompanyUserRoleGetDtoResponse } from '@project/common/platform/api/company';
import { COMPANY_USER_ROLE_GET_ROLE } from '@project/common/platform/company';

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
    public async executeExtended(@Param('companyId', ParseIntPipe) companyId: number, @Param('userId', ParseIntPipe) userId: number, @Req() request: IUserHolder): Promise<ICompanyUserRoleGetDtoResponse> {
        let user = request.user;

        let item = await this.database.companyGet(companyId, userId);
        let companyRole = !user.isAdministrator ? COMPANY_USER_ROLE_GET_ROLE: null;
        UserGuard.checkCompany({ isCompanyRequired: true, companyRole }, await this.database.companyGet(companyId, user));

        return item.toUserObject().roles;
    }
}
