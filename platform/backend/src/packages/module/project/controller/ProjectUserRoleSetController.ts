import { Controller, Post, ParseArrayPipe, ParseIntPipe, Body, Type, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserProject, UserType } from '@project/common/platform/user';
import { COMPANY_URL, PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';
import { IProjectUserRoleSetDtoResponse } from '@project/common/platform/api/project';
import { LedgerProjectRole } from '@project/common/ledger/role';

@Controller(`${PROJECT_URL}/:projectId/role/:userId`)
export class ProjectUserRoleSetController extends DefaultController<void, IProjectUserRoleSetDtoResponse> {
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

    private async sendToLedger(userId: number, projectId: number, roles: Array<LedgerProjectRole>): Promise<void> {
        // ProjectUserEditCommand
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
        type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER]
    })
    public async executeExtended(@Param('projectId', ParseIntPipe) projectId: number, @Param('userId', ParseIntPipe) userId: number, @Body(new ParseArrayPipe()) roles: Array<LedgerProjectRole>, @Req() request: IUserHolder): Promise<IProjectUserRoleSetDtoResponse> {
        let user = request.user;
        let project = await this.database.projectGet(projectId, user)

        if (user.type !== UserType.ADMINISTRATOR) {
            UserGuard.checkProject({
                isProjectRequired: true,
                projectRole: [LedgerProjectRole.PROJECT_MANAGER, LedgerProjectRole.USER_MANAGER]
            }, project);
        }
        else {
            UserGuard.checkProject({
                isProjectRequired: true
            }, project);
        }

        let exists = project.toUserObject().roles;

        let toRemove = _.difference(exists, roles);
        let toAdd = _.difference(roles, exists);

        await this.sendToLedger(projectId, userId, roles);

        await this.database.getConnection().transaction(async manager => {
            let repository = manager.getRepository(UserRoleEntity);

            if (!_.isEmpty(toRemove)) {
                await repository.createQueryBuilder()
                    .delete()
                    .where('userId = :userId', { userId })
                    .where('projectId = :projectId', { projectId })
                    .where('name IN (:...names)', { names: toRemove })
                    .execute();
            }

            if (!_.isEmpty(toAdd)) {
                for (let name of toAdd) {
                    await repository.save(new UserRoleEntity(userId, name, null, projectId));
                }
            }
        });

        project = await this.database.projectGet(projectId, userId);
        return project.toUserObject();
    }
}
