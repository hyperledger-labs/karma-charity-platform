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
import { IProjectToVerifyDtoResponse } from '@project/common/platform/api/project';
import { ProjectStatus, PROJECT_TO_VERIFY_ROLE, PROJECT_TO_VERIFY_STATUS } from '@project/common/platform/project';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { TransformGroup } from '@project/module/database';
import { PROJECT_TO_VERIFY_TYPE } from '@project/common/platform/project';

@Controller(`${PROJECT_URL}/:id/toVerify`)
export class ProjectToVerifyController extends DefaultController<number, IProjectToVerifyDtoResponse> {
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

    @Swagger({ name: 'Project to verify', response: UserProject })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: PROJECT_TO_VERIFY_TYPE })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectToVerifyDtoResponse> {
        let item = await this.database.projectGet(projectId, request.user);

        let projectRole = PROJECT_TO_VERIFY_ROLE;
        let projectStatus = PROJECT_TO_VERIFY_STATUS;
        UserGuard.checkProject({ isProjectRequired: true, projectStatus, projectRole }, item);

        item = await this.database.projectStatus(item, ProjectStatus.VERIFICATION_PROCESS);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
