import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { ParseIntPipe } from '@nestjs/common';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserProject } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { ProjectStatus, PROJECT_ACTIVATE_ROLE, PROJECT_ACTIVATE_STATUS, PROJECT_REJECT_STATUS } from '@project/common/platform/project';
import { IProjectActivateDtoResponse } from '@project/common/platform/api/project';
import { ProjectEntity } from '@project/module/database/project';
import { LedgerProject, LedgerProjectStatus } from '@project/common/ledger/project';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { TransformGroup } from '@project/module/database';
import { PROJECT_ACTIVATE_TYPE } from '@project/common/platform/project';
import { LedgerService } from '@project/module/ledger/service';

@Controller(`${PROJECT_URL}/:id/activate`)
export class ProjectActivateController extends DefaultController<number, IProjectActivateDtoResponse> {
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
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async createInLedger(project: ProjectEntity): Promise<LedgerProject> {
        let item = LedgerProject.create(new Date(), _.padStart('2', 64, '2'));
        item.status = LedgerProjectStatus.ACTIVE;
        item.createdDate = new Date();
        item.description = project.preferences.descriptionShort;
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Project activate', response: UserProject })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: PROJECT_ACTIVATE_TYPE
    })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectActivateDtoResponse> {
        let project = await this.database.projectGet(projectId, request.user);
        let projectRole = PROJECT_ACTIVATE_ROLE;
        let projectStatus = PROJECT_ACTIVATE_STATUS;
        UserGuard.checkProject({ isProjectRequired: true, projectStatus, projectRole }, project);

        let company = await this.database.companyGet(project.companyId, request.user);
        UserGuard.checkCompany({ isCompanyRequired: true, isCompanyLedgerRequired: true }, company);

        let item = await this.ledger.projectAdd(request.user.ledgerUid, project, company);

        await this.database.projectStatus(item, ProjectStatus.ACTIVE);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
