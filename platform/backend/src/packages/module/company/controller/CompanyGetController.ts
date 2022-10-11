import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { CompanyNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { COMPANY_URL, USER_URL } from '@project/common/platform/api';
import { UserCompany, UserType } from '@project/common/platform/user';
import { IUserHolder } from '@project/module/database/user';
import { ICompanyGetDtoResponse } from '@project/common/platform/api/company';
import { TransformGroup } from '@project/module/database';
import { LedgerCompanyRole } from '@project/common/ledger/role';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${COMPANY_URL}/:id`)
export class CompanyGetController extends DefaultController<number, ICompanyGetDtoResponse> {
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

    @Swagger({ name: `Get company by id`, response: UserCompany })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        required: false
    })
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder,): Promise<ICompanyGetDtoResponse> {
        let user = request.user;

        let item = await this.database.companyGet(id, !_.isNil(user) ? user.id : null);
        UserGuard.checkCompany({ isCompanyRequired: true }, item);

        let groups = [TransformGroup.PUBLIC_DETAILS];
        if ((!_.isNil(user) && user.isAdministrator) || UserGuard.isHasRole([LedgerCompanyRole.COMPANY_MANAGER], item.userRoles)) {
            groups.push(TransformGroup.PRIVATE);
        }
        return item.toUserObject({ groups });
    }
}
