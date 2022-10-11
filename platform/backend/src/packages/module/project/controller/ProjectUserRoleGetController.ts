import { Controller, Get, ParseIntPipe, Param, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { UserProject } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { IProjectUserRoleGetDtoResponse } from '@project/common/platform/api/project';
import { PROJECT_USER_ROLE_GET_ROLE } from '@project/common/platform/project';

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
    public async executeExtended(@Param('projectId', ParseIntPipe) projectId: number, @Param('userId', ParseIntPipe) userId: number, @Req() request: IUserHolder): Promise<IProjectUserRoleGetDtoResponse> {
        let user = request.user;

        let item = await this.database.projectGet(projectId, userId);
        let projectRole = !user.isAdministrator ? PROJECT_USER_ROLE_GET_ROLE : null;
        UserGuard.checkProject({ isProjectRequired: true, projectRole }, await this.database.projectGet(projectId, user));

        return item.toUserObject().roles;
    }
}
