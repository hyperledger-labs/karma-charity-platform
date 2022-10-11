
import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { ValidateUtil } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { DatabaseService } from '@project/module/database/service';
import { UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IProjectVerifyDtoResponse } from '@project/common/platform/api/project';
import { ProjectStatus, PROJECT_REJECT_STATUS, PROJECT_REJECT_TYPE } from '@project/common/platform/project';
import { Project } from '@project/common/platform/project';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';

@Controller(`${PROJECT_URL}/:id/reject`)
export class ProjectRejectController extends DefaultController<number, IProjectVerifyDtoResponse> {
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

    @Swagger({ name: 'Project reject', response: Project })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: PROJECT_REJECT_TYPE })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectVerifyDtoResponse> {
        let item = await this.database.projectGet(projectId);

        let projectStatus = PROJECT_REJECT_STATUS;
        UserGuard.checkProject({ isProjectRequired: true, projectStatus }, item);

        item = await this.database.projectStatus(item, ProjectStatus.REJECTED);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}

