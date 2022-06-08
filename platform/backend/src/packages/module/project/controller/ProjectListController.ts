import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { Project } from '@project/common/platform/project';
import { UserProject, UserType } from '@project/common/platform/user';
import { ProjectEntity } from '@project/module/database/project';
import { COMPANY_URL, PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ProjectListDto implements Paginable<Project> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Project>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Project>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class ProjectListDtoResponse implements IPagination<UserProject> {
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

@Controller(PROJECT_URL)
export class ProjectListController extends DefaultController<ProjectListDto, ProjectListDtoResponse> {
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

    @Swagger({ name: 'Get project list', response: ProjectListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    // @UserGuardOptions({ type: [UserType.ADMINISTRATOR, UserType.EDITOR, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER] })
    public async executeExtended(@Query({ transform: Paginable.transform }) params: ProjectListDto, @Req() request: IUserHolder): Promise<ProjectListDtoResponse> {
        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.project.createQueryBuilder('project')
        query = query.innerJoinAndSelect('project.preferences', 'preferences')
        query = query.leftJoinAndMapMany('project.userRoles', UserRoleEntity, 'role', `role.userId = ${request.user.id} and role.projectId = project.id`)

        if (request.user.type === UserType.COMPANY_MANAGER || request.user.type === UserType.COMPANY_WORKER) {
            query = query.where('project.companyId = :companyId', { companyId: !_.isNil(request.company) ? request.company.id : null })
        }

        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: ProjectEntity): Promise<UserProject> => item.toUserObject();
}
