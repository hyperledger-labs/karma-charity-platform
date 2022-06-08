import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { ParseIntPipe } from '@nestjs/common';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { UserProject, UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { ProjectStatus } from '@project/common/platform/project';
import { IProjectActivateDtoResponse } from '@project/common/platform/api/project';
import { ProjectEntity } from '@project/module/database/project';
import { LedgerProject, LedgerProjectStatus } from '@project/common/ledger/project';
import { TraceUtil } from '@ts-core/common/trace';
import { CompanyStatus } from '@project/common/platform/company';
import { LedgerProjectRole } from '@project/common/ledger/role';

@Controller(`${PROJECT_URL}/:id/activate`)
export class ProjectActivateController extends DefaultController<number, IProjectActivateDtoResponse> {
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

    @Swagger({ name: 'Project to activate', response: UserProject })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER],
        company: {
            required: true,
            status: [CompanyStatus.ACTIVE]
        }
    })
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Req() request: IUserHolder): Promise<IProjectActivateDtoResponse> {
        let project = await this.database.projectGet(projectId, request.user);
        UserGuard.checkProject({
            isProjectRequired: true,
            projectStatus: [ProjectStatus.VERIFIED],
            projectRole: [LedgerProjectRole.PROJECT_MANAGER]
        }, project);

        let ledger = await this.createInLedger(project);
        project.ledgerUid = ledger.uid;

        project.status = ProjectStatus.ACTIVE;

        await this.database.projectSave(project);
        return project.toUserObject();
    }
}
