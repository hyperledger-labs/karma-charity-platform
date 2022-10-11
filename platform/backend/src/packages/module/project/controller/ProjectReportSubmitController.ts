import { Controller, Post, Req, Param, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import { ValidateUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserProject, UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { ProjectStatus, PROJECT_REPORT_SUBMIT_ROLE } from '@project/common/platform/project';
import { IProjectReportSubmitDtoResponse } from '@project/common/platform/api/project';
import { TransformGroup } from '@project/module/database';
import { PROJECT_REPORT_SUBMIT_STATUS, PROJECT_REPORT_SUBMIT_TYPE } from '@project/common/platform/project';

@Controller(`${PROJECT_URL}/:id/reportSubmit`)
export class ProjectReportSubmitController extends DefaultController<number, IProjectReportSubmitDtoResponse> {
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

    @Swagger({ name: 'Project report submit', response: UserProject })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: PROJECT_REPORT_SUBMIT_TYPE })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectReportSubmitDtoResponse> {
        let item = await this.database.projectGet(projectId, request.user);

        let projectRole = PROJECT_REPORT_SUBMIT_ROLE;
        let projectStatus = PROJECT_REPORT_SUBMIT_STATUS;
        UserGuard.checkProject({ isProjectRequired: true, projectStatus, projectRole }, item);

        item = await this.database.projectStatus(item, ProjectStatus.REPORT_SUBMITTED);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
