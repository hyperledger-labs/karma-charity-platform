import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { FilterableConditions, FilterableSort, Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { Project, ProjectPreferences } from '@project/common/platform/project';
import { ProjectEntity } from '@project/module/database/project';
import { PROJECT_PUBLIC_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { IProjectPublicListDto, IProjectPublicListDtoResponse } from '@project/common/platform/api/project';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { FavoriteEntity } from '@project/module/database/favorite';
import { UserProject } from '@project/common/platform/user';
import { FavoriteStatus } from '@project/common/platform/favorite';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ProjectPublicListDto implements IProjectPublicListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Project>;

    @ApiPropertyOptional()
    conditionsExtras?: FilterableConditions<ProjectPreferences>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Project>;

    @ApiPropertyOptional()
    sortExtras?: FilterableSort<ProjectPreferences>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class ProjectPublicListDtoResponse implements IProjectPublicListDtoResponse {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: UserProject })
    items: Array<UserProject>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PROJECT_PUBLIC_URL)
export class ProjectPublicListController extends DefaultController<ProjectPublicListDto, ProjectPublicListDtoResponse> {
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

    @Swagger({ name: 'Get project public list', response: ProjectPublicListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ required: false })
    public async executeExtended(@Query({ transform: Paginable.transform }) params: ProjectPublicListDto, @Req() request: IUserHolder): Promise<ProjectPublicListDtoResponse> {
        let query = this.database.project.createQueryBuilder('project');
        this.database.addProjectRelations(query, request.user);

        if (!_.isEmpty(params.conditionsExtras)) {
            TypeormUtil.applyConditions(query, params.conditionsExtras, 'projectPreferences');
        }
        if (!_.isEmpty(params.sortExtras)) {
            TypeormUtil.applySort(query, params.sortExtras, 'projectPreferences');
        }
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: ProjectEntity): Promise<UserProject> => item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
