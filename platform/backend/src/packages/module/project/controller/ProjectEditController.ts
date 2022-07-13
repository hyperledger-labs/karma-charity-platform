import { Body, Controller, Param, Put, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil } from '@ts-core/common/util';
import { IProjectEditDto, IProjectEditDtoResponse } from '@project/common/platform/api/project';
import { Project, ProjectPreferences, ProjectPurpose, ProjectStatus, PROJECT_EDIT_ROLE, PROJECT_EDIT_STATUS } from '@project/common/platform/project';
import { PROJECT_URL } from '@project/common/platform/api';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { TransformGroup } from '@project/module/database';
import { ProjectPurposeEntity } from '@project/module/database/project/ProjectPurposeEntity';
import { ProjectUtil } from '../util';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class ProjectEditDto implements IProjectEditDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDefined()
    preferences?: Partial<ProjectPreferences>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDefined()
    purposes?: Array<ProjectPurpose>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${PROJECT_URL}/:id`)
export class ProjectEditController extends DefaultController<IProjectEditDto, IProjectEditDtoResponse> {
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

    @Swagger({ name: 'Project edit', response: Project })
    @Put()
    @UseGuards(UserGuard)
    public async executeExtended(@Param('id', ParseIntPipe) projectId: number, @Body() params: ProjectEditDto, @Req() request: IUserHolder): Promise<IProjectEditDtoResponse> {
        let user = request.user;
        let item = await this.database.projectGet(projectId, user);

        let projectRole = !user.isAdministrator ? PROJECT_EDIT_ROLE : null;
        let projectStatus = !user.isAdministrator ? PROJECT_EDIT_STATUS : null;
        UserGuard.checkProject({ isProjectRequired: true, projectStatus, projectRole }, item);

        ObjectUtil.copyPartial(params.preferences, item.preferences);
        if (!_.isNil(params.purposes)) {
            item.purposes = params.purposes.map(purpose => new ProjectPurposeEntity(purpose));
            ProjectUtil.checkRequiredAccounts(item);
        }

        if (user.isAdministrator && !_.isNil(params.status)) {
            item.status = params.status;
        }

        item = await this.database.project.save(item);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
