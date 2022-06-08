import { Controller, Get, ParseIntPipe, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserProject, UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { IProjectUserRoleGetDtoResponse } from '@project/common/platform/api/project';
import { LedgerProjectRole } from '@project/common/ledger/role';

@Controller(`${PROJECT_URL}/:projectId/role/:userId`)
export class ProjectUserRoleGetController extends DefaultController<void, IProjectUserRoleGetDtoResponse> {
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

    @Swagger({ name: 'Get project user roles list', response: UserProject })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER]
    })
    public async executeExtended(@Param('projectId', ParseIntPipe) projectId: number, @Param('userId', ParseIntPipe) userId: number, @Req() request: IUserHolder): Promise<IProjectUserRoleGetDtoResponse> {
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

        return project.toUserObject().roles as Array<LedgerProjectRole>;
    }
}
