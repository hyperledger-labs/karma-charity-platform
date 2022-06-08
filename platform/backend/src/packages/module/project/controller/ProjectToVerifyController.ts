import { Controller, Post, Req, Param, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { ParseIntPipe } from '@nestjs/common';
import { ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserProject, UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IProjectToVerifyDtoResponse } from '@project/common/platform/api/project';
import { ProjectStatus } from '@project/common/platform/project';
import { LedgerProjectRole } from '@project/common/ledger/role';

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
    @UserGuardOptions({ type: [UserType.COMPANY_MANAGER] })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectToVerifyDtoResponse> {
        let project = await this.database.projectGet(projectId, request.user);
        UserGuard.checkProject({
            isProjectRequired: true,
            projectStatus: [ProjectStatus.DRAFT, ProjectStatus.REJECTED],
            projectRole: [LedgerProjectRole.PROJECT_MANAGER]
        }, project);

        project = await this.database.projectStatus(project, ProjectStatus.VERIFICATION_PROCESS);
        return project.toUserObject();
    }
}
