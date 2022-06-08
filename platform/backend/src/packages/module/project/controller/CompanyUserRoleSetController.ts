import { Controller, Post, ParseArrayPipe, ParseIntPipe, Body, Type, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserCompany, UserType } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';
import { ICompanyUserRoleSetDtoResponse } from '@project/common/platform/api/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { ValidateUtil } from '@ts-core/common/util';

@Controller(`${COMPANY_URL}/:companyId/role/:userId`)
export class CompanyUserRoleSetController extends DefaultController<void, ICompanyUserRoleSetDtoResponse> {
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

    private async sendToLedger(userId: number, companyId: number, roles:Array<LedgerCompanyRole>): Promise<void> {
        // CompanyUserEditCommand
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
        type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER]
    })
    public async executeExtended(@Param('companyId', ParseIntPipe) companyId: number, @Param('userId', ParseIntPipe) userId: number, @Body(new ParseArrayPipe()) roles: Array<LedgerCompanyRole>, @Req() request: IUserHolder): Promise<ICompanyUserRoleSetDtoResponse> {
        let user = request.user;
        let company = request.company;

        if (user.type !== UserType.ADMINISTRATOR) {
            UserGuard.checkCompany({ isCompanyRequired: true, companyRole: [LedgerCompanyRole.COMPANY_MANAGER] }, company);
            companyId = company.id;
        }

        company = await this.database.companyGet(companyId, userId);
        let exists = company.toUserObject().roles;

        let toRemove = _.difference(exists, roles);
        let toAdd = _.difference(roles, exists);

        await this.sendToLedger(companyId, userId, roles);

        await this.database.getConnection().transaction(async manager => {
            let repository = manager.getRepository(UserRoleEntity);

            if (!_.isEmpty(toRemove)) {
                await repository.createQueryBuilder()
                    .delete()
                    .where('userId = :userId', { userId })
                    .where('companyId = :companyId', { companyId })
                    .where('name IN (:...names)', { names: toRemove })
                    .execute();
            }

            if (!_.isEmpty(toAdd)) {
                for (let name of toAdd) {
                    await repository.save(new UserRoleEntity(userId, name, companyId));
                }
            }
        });

        company = await this.database.companyGet(companyId, userId);
        return company.toUserObject();
    }
}
