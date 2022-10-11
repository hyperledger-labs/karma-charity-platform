import { Controller, Post, ParseArrayPipe, ParseIntPipe, Body, Type, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserProject } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';
import { IProjectUserRoleSetDtoResponse } from '@project/common/platform/api/project';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { LedgerService } from '@project/module/ledger/service';
import { PROJECT_USER_ROLE_SET_ROLE, PROJECT_USER_ROLE_SET_TYPE } from '@project/common/platform/project';

@Controller(`${PROJECT_URL}/:projectId/role/:userId`)
export class ProjectUserRoleSetController extends DefaultController<void, IProjectUserRoleSetDtoResponse> {
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

    @Swagger({ name: 'Get project user roles list', response: UserProject })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: PROJECT_USER_ROLE_SET_TYPE,
        ledgerRequired: true,
    })
    public async executeExtended(@Param('projectId', ParseIntPipe) projectId: number, @Param('userId', ParseIntPipe) userId: number, @Body(new ParseArrayPipe()) roles: Array<LedgerProjectRole>, @Req() request: IUserHolder): Promise<IProjectUserRoleSetDtoResponse> {
        let owner = request.user;

        let user = await this.database.userGet(userId);
        UserGuard.checkUser({ isRequired: true, isLedgerRequired: true }, user);

        let projectRole = !owner.isAdministrator ? PROJECT_USER_ROLE_SET_ROLE : null;
        UserGuard.checkProject({ isProjectRequired: true, projectRole }, await this.database.projectGet(projectId, owner));

        let project = await this.database.projectGet(projectId, userId);
        await this.ledger.projectUserRoleSet(owner, project, user, roles);

        let exists = project.toUserObject().roles;
        let toAdd = _.difference(roles, exists);
        let toRemove = _.difference(exists, roles);

        await this.database.getConnection().transaction(async manager => {
            let repository = manager.getRepository(UserRoleEntity);

            if (!_.isEmpty(toRemove)) {
                await repository.createQueryBuilder()
                    .delete()
                    .where('userId = :userId', { userId })
                    .andWhere('projectId = :projectId', { projectId })
                    .andWhere('name IN (:...names)', { names: toRemove })
                    .execute();
            }

            if (!_.isEmpty(toAdd)) {
                await repository.save(toAdd.map(name => new UserRoleEntity(userId, name, null, projectId)));
            }
        });

        project = await this.database.projectGet(projectId, userId);
        return project.toUserObject();
    }
}
