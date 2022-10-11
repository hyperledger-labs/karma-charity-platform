
import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { DatabaseService } from '@project/module/database/service';
import { UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IProjectVerifyDtoResponse } from '@project/common/platform/api/project';
import { Project, ProjectStatus } from '@project/common/platform/project';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';

@Controller(`${PROJECT_URL}/:id/verify`)
export class ProjectVerifyController extends DefaultController<number, IProjectVerifyDtoResponse> {
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

    @Swagger({ name: 'Project verify', response: Project })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.EDITOR, UserType.ADMINISTRATOR] })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectVerifyDtoResponse> {
        let item = await this.database.projectGet(projectId);

        let projectStatus = [ProjectStatus.VERIFICATION_PROCESS];
        UserGuard.checkProject({ isProjectRequired: true, projectStatus }, item);

        item = await this.database.projectStatus(item, ProjectStatus.VERIFIED);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}

