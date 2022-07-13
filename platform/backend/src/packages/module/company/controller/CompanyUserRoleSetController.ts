import { Controller, Post, ParseArrayPipe, ParseIntPipe, Body, Type, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserCompany, UserType } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { ICompanyUserRoleSetDtoResponse } from '@project/common/platform/api/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { COMPANY_USER_ROLE_SET_ROLE } from '@project/common/platform/company';
import { LedgerService } from '@project/module/ledger/service';
import { CompanyEntity } from '@project/module/database/company';

@Controller(`${COMPANY_URL}/:companyId/role/:userId`)
export class CompanyUserRoleSetController extends DefaultController<void, ICompanyUserRoleSetDtoResponse> {
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

    @Swagger({ name: 'Get company user roles list', response: UserCompany })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        // type: COMPANY_USER_ROLE_SET_TYPE,
        ledgerRequired: true,
    })
    public async executeExtended(@Param('companyId', ParseIntPipe) companyId: number, @Param('userId', ParseIntPipe) userId: number, @Body(new ParseArrayPipe()) roles: Array<LedgerCompanyRole>, @Req() request: IUserHolder): Promise<ICompanyUserRoleSetDtoResponse> {
        let owner = request.user;

        let user = await this.database.userGet(userId);
        UserGuard.checkUser({ isRequired: true, isLedgerRequired: true }, user);

        let companyRole = !owner.isAdministrator ? COMPANY_USER_ROLE_SET_ROLE : null;
        UserGuard.checkCompany({ isCompanyRequired: true, isCompanyLedgerRequired: true, companyRole }, await this.database.companyGet(companyId, owner));

        let company = await this.database.companyGet(companyId, userId);
        await this.ledger.companyUserRoleSet(owner, company, user, roles);
  
        let exists = company.toUserObject().roles;
        let toAdd = _.difference(roles, exists);
        let toRemove = _.difference(exists, roles);

        await this.database.getConnection().transaction(async manager => {
            let repository = manager.getRepository(UserRoleEntity);

            if (!_.isEmpty(toRemove)) {
                await repository.createQueryBuilder()
                    .delete()
                    .where('userId = :userId', { userId })
                    .andWhere('companyId = :companyId', { companyId })
                    .andWhere('name IN (:...names)', { names: toRemove })
                    .execute();
            }

            if (!_.isEmpty(toAdd)) {
                await repository.save(toAdd.map(name => new UserRoleEntity(userId, name, companyId)));
            }

            if (user.type === UserType.COMPANY_WORKER && _.isNil(user.companyId)) {
                user.companyId = companyId;
                await manager.getRepository(UserEntity).save(user);
            }
        });

        company = await this.database.companyGet(companyId, userId);
        return company.toUserObject();
    }
}
